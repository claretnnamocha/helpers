import * as bitcoin from 'bitcoinjs-lib';
import ecPairFactory from 'ecpair';
import bip32Factory from 'bip32';
import * as bip39 from 'bip39';
import fetch from 'node-fetch';
import * as ecc from 'tiny-secp256k1';
import {
  Amount,
  CreateAddress,
  GetBalance,
  GetTrxnHash,
  ImportAddress,
  UTXO,
  Wallet,
  ImportAddressFromMnemonic,
  MnemonicOnly,
  AddressOnly,
  EntropyOnly,
  CreateAddressFromXPub,
  EstimateFeeWithHD,
  EstimateFee,
  Send,
  SendWithHD,
} from '../types/crypto/bitcoin';

const ECPair = ecPairFactory(ecc);
const bip32 = bip32Factory(ecc);
const validator = (
    pubkey: Buffer,
    msghash: Buffer,
    signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

const getBaseURL = ({testnet = false}) => {
  return testnet ?
    'https://blockstream.info/testnet/api' :
    'https://blockstream.info/api';
};

const calculateTxFee = async ({testnet = false, tx}) => {
  let fee: number;

  const link = getBaseURL({testnet}) + '/mempool';

  const vSize: number = tx.virtualSize();
  const response = await fetch(link);
  const mempool: any = await response.json();
  const histogram: Array<Array<number>> = mempool.fee_histogram;

  if (histogram.length == 1) {
    fee = histogram[0][0] * vSize;
  } else {
    histogram.sort((a, b) => a[1] - b[1]);
    for (const h of histogram) {
      if (h[1] === histogram[histogram.length - 1][1]) {
        fee = h[0] * vSize;
      }

      if (vSize <= h[1]) {
        fee = h[0] * vSize;
        break;
      }
    }
  }

  const satoshi = Math.ceil(fee) | 0;
  const btc = satoshi / Math.pow(10, 8);

  return {satoshi, btc};
};

const gatherUtxos = async ({utxos, testnet}) => {
  const network = getBtcNetwork({testnet});
  const psbt = new bitcoin.Psbt({network});
  let total = 0;

  for (const utxo of utxos) {
    total += utxo.value;

    const trxid = utxo.txid;
    const index = utxo.vout;
    let nonWitnessUtxo: string | Buffer = await getUtxosHash({
      trxid,
      testnet,
    });
    nonWitnessUtxo = Buffer.from(nonWitnessUtxo, 'hex');

    psbt.addInput({
      hash: trxid,
      index,
      nonWitnessUtxo,
    });
  }

  return {psbt, total};
};

const estimateBtcFee = async ({
  sender,
  testnet,
  amounts,
  addresses,
  keyPair,
}) => {
  let {satoshi: balance}: Amount = await getBtcBalance({
    address: sender,
    testnet,
  });

  const total = amounts.reduce((a, b) => a + b, 0);
  if (total > balance) throw new Error('Insufficient balance');

  const utxos: Array<UTXO> = await getUtxos({address: sender, testnet});

  const {psbt} = await gatherUtxos({utxos, testnet});

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const amount = amounts[i];

    psbt.addOutput({address, value: amount});

    balance -= amount;
  }

  psbt.addOutput({address: sender, value: balance});

  psbt.signAllInputs(keyPair);
  psbt.validateSignaturesOfAllInputs(validator);
  psbt.finalizeAllInputs();

  const tx = psbt.extractTransaction();

  return await calculateTxFee({tx, testnet});
};

const sendBtc = async ({
  addresses,
  amounts,
  fee,
  sender,
  keyPair,
  testnet = false,
}): Promise<string> => {
  let {satoshi: balance}: Amount = await getBtcBalance({
    address: sender,
    testnet,
  });

  const total = amounts.reduce((a, b) => a + b, 0);
  if (total > balance) throw new Error('Insufficient balance');

  const utxos: Array<UTXO> = await getUtxos({address: sender, testnet});

  const {psbt} = await gatherUtxos({utxos, testnet});

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const amount = amounts[i];

    psbt.addOutput({address, value: amount});

    balance -= amount;
  }

  balance -= fee;

  psbt.addOutput({address: sender, value: balance});

  psbt.signAllInputs(keyPair);
  psbt.validateSignaturesOfAllInputs(validator);
  psbt.finalizeAllInputs();

  const tx = psbt.extractTransaction();
  const body = tx.toHex();

  const link = getBaseURL({testnet}) + '/tx';

  const response = await fetch(link, {method: 'post', body});
  return await response.text();
};

const getBtcNetwork = ({testnet}): bitcoin.Network => {
  return testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
};

const getUtxos = async ({
  address,
  testnet = false,
}: GetBalance): Promise<Array<UTXO>> => {
  const link = getBaseURL({testnet}) + `/address/${address}/utxo`;

  const response = await fetch(link);
  const data: any = await response.json();

  return data;
};

const getUtxosHash = async ({
  trxid,
  testnet = false,
}: GetTrxnHash): Promise<string> => {
  const link = getBaseURL({testnet}) + `/tx/${trxid}/hex`;

  const response = await fetch(link);
  const data = await response.text();

  return data;
};

export const generateMnemonic = (): string => {
  return bip39.generateMnemonic();
};

export const mnemonicToEntropy = ({mnemonic}: MnemonicOnly): string => {
  return bip39.mnemonicToEntropy(mnemonic);
};

export const entropyToMnemonic = ({entropy}: EntropyOnly): string => {
  return bip39.entropyToMnemonic(entropy);
};

export const generateXPubKeyFromMnemonic = async ({
  mnemonic,
}: MnemonicOnly): Promise<string> => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed);
  return node.neutered().toBase58();
};

export const generateXPrvKeyFromMnemonic = async ({
  mnemonic,
}: MnemonicOnly): Promise<string> => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed);
  return node.toBase58();
};

export const createBtcAddress = ({
  testnet = false,
}: CreateAddress): Wallet => {
  const network = getBtcNetwork({testnet});
  const keyPair = ECPair.makeRandom({network});
  const {address} = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  });
  const wif = keyPair.toWIF();
  const privateKey = keyPair.privateKey.toString();

  return {wif, address, privateKey};
};

export const createBtcAddressFromMnemonic = ({
  mnemonic,
  index,
  testnet = false,
}: ImportAddressFromMnemonic): Wallet => {
  const network = getBtcNetwork({testnet});

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const path = `m/49'/1'/0'/0/${index}`;
  const child = root.derivePath(path);

  const {address} = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network,
  });

  return {
    address,
    privateKey: child.privateKey.toString(),
    wif: child.toWIF(),
  };
};

export const createBtcAddressFromXPubKey = ({
  xpub,
  index,
  testnet = false,
}: CreateAddressFromXPub): AddressOnly => {
  const network = getBtcNetwork({testnet});

  const {address} = bitcoin.payments.p2pkh({
    pubkey: bip32.fromBase58(xpub).derive(0).derive(index).publicKey,
    network,
  });

  return {address};
};

export const importBtcAddress = ({
  wif,
  testnet = false,
}: ImportAddress): Wallet => {
  const network = getBtcNetwork({testnet});

  const keyPair = ECPair.fromWIF(wif, network);
  const {address} = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  });

  const privateKey = keyPair.privateKey.toString();

  return {wif, address, privateKey};
};

export const getBtcBalance = async ({
  address,
  testnet = false,
}: GetBalance): Promise<Amount> => {
  const link = testnet ?
    `http://api.blockcypher.com/v1/btc/test3//addrs/${address}` :
    `https://blockchain.info/address/${address}?format=jsonrawaddr`;
  const response = await fetch(link);
  const data: any = await response.json();
  const satoshi: number = data.final_balance;
  const btc: number = satoshi / Math.pow(10, 8);

  return {satoshi, btc};
};

export const estimateFee = async ({
  wif,
  addresses,
  amounts,
  testnet = false,
}: EstimateFee): Promise<any> => {
  const network = getBtcNetwork({testnet});

  const {address: sender}: Wallet = importBtcAddress({
    wif,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  return await estimateBtcFee({
    sender,
    testnet,
    amounts,
    addresses,
    keyPair,
  });
};

export const estimateFeeWithHDKeys = async ({
  xprv,
  xpub,
  addresses,
  amounts,
  index,
  testnet = false,
}: EstimateFeeWithHD): Promise<any> => {
  const network = getBtcNetwork({testnet});

  const {address: sender}: AddressOnly = createBtcAddressFromXPubKey({
    xpub,
    index,
    testnet,
  });

  const keyPair = ECPair.fromPrivateKey(Buffer.from(xprv), {network});

  return await estimateBtcFee({
    sender,
    testnet,
    amounts,
    addresses,
    keyPair,
  });
};

export const send = async ({
  wif,
  addresses,
  amounts,
  fee,
  testnet = false,
}: Send): Promise<any> => {
  const network = getBtcNetwork({testnet});

  const {address: sender}: Wallet = importBtcAddress({
    wif,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  return await sendBtc({addresses, amounts, fee, keyPair, testnet, sender});
};

export const sendWithHDKeys = async ({
  xprv,
  xpub,
  addresses,
  amounts,
  index,
  fee,
  testnet = false,
}: SendWithHD): Promise<any> => {
  const network = getBtcNetwork({testnet});

  const {address: sender}: AddressOnly = createBtcAddressFromXPubKey({
    xpub,
    index,
    testnet,
  });
  const keyPair = ECPair.fromPrivateKey(Buffer.from(xprv), {network});

  return await sendBtc({addresses, amounts, fee, keyPair, testnet, sender});
};
