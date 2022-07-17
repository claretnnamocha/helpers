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
  ImportAddress,
  UTXO,
  Wallet,
  ImportAddressFromMnemonic,
  MnemonicOnly,
  EntropyOnly,
  CreateAddressFromHDKey,
  EstimateFee,
  Send,
  SendWithHD,
  SendBTC,
  TransactionReceipt,
  GetTxHash,
  NetworkOnly,
  CalculateTxFee,
  GatherUTXOS,
  SendTransaction,
  GetBtcTransaction,
} from '../types/crypto/bitcoin';

const ECPair = ecPairFactory(ecc);
const bip32 = bip32Factory(ecc);
const validator = (
    pubkey: Buffer,
    msghash: Buffer,
    signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

const getBaseURL = ({testnet = false}: NetworkOnly) => {
  return testnet ?
    'https://blockstream.info/testnet/api' :
    'https://blockstream.info/api';
};

const getPath = (index: number) => `m/49'/1'/0'/0/${index}'`;

const calculateTxFee = async ({testnet = false, tx}: CalculateTxFee) => {
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
  const btc = satoshiToBtc(satoshi);

  return {satoshi, btc};
};

const gatherUtxos = async ({utxos, testnet}: GatherUTXOS) => {
  const network = getBtcNetwork({testnet});
  const psbt = new bitcoin.Psbt({network});
  let total = 0;

  for (const utxo of utxos) {
    total += utxo.value;

    const txid = utxo.txid;
    const index = utxo.vout;
    let nonWitnessUtxo: string | Buffer = await getUtxosHash({
      txid,
      testnet,
    });
    nonWitnessUtxo = Buffer.from(nonWitnessUtxo, 'hex');

    psbt.addInput({
      hash: txid,
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
}): Promise<Amount> => {
  let {satoshi: balance}: Amount = await getBtcBalance({
    address: sender,
    testnet,
  });

  amounts = amounts.map((amount) => parseBTC(amount));

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

  return calculateTxFee({tx, testnet});
};

const sendBtc = async ({
  addresses,
  amounts,
  fee,
  sender,
  keyPair,
  testnet = false,
}: SendBTC): Promise<TransactionReceipt> => {
  fee = Math.ceil(fee * 1.02) | 0;
  let {satoshi: balance}: Amount = await getBtcBalance({
    address: sender,
    testnet,
  });

  amounts = amounts.map((amount) => parseBTC(amount));

  const total = amounts.reduce((a, b) => a + b, 0);

  if (amounts.length !== addresses.length) {
    throw new Error('Length of addresses and amounts do not match');
  }

  if (total > balance) throw new Error('Insufficient balance');

  const utxos: Array<UTXO> = await getUtxos({address: sender, testnet});

  const {psbt} = await gatherUtxos({utxos, testnet});

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const amount = amounts[i];

    psbt.addOutput({address, value: amount});
  }

  balance = balance - total - fee;

  psbt.addOutput({address: sender, value: balance});

  psbt.signAllInputs(keyPair);
  psbt.validateSignaturesOfAllInputs(validator);
  psbt.finalizeAllInputs();

  const tx = psbt.extractTransaction();
  const body = tx.toHex();

  const link = getBaseURL({testnet}) + '/tx';

  const response = await fetch(link, {method: 'post', body});
  const text = await response.text();

  const hexRegex = /^(0x|0X)?[a-fA-F0-9]+$/;
  const sent = hexRegex.test(text);

  if (!sent) throw new Error(text);

  return {transactionId: text};
};

const drainBtc = async ({
  to,
  minimumBalance,
  sender,
  keyPair,
  testnet = false,
}): Promise<TransactionReceipt> => {
  const {satoshi: amount}: Amount = await getBtcBalance({
    address: sender,
    testnet,
  });

  if (amount < minimumBalance) throw new Error('Insufficient balance');

  const utxos: Array<UTXO> = await getUtxos({address: sender, testnet});

  const {psbt} = await gatherUtxos({utxos, testnet});

  const wif = keyPair.toWIF();

  const {satoshi: fee} = await estimateFee({
    wif,
    addresses: [to],
    amounts: [satoshiToBtc(amount)],
    testnet,
  });

  psbt.addOutput({address: to, value: amount - fee});

  psbt.signAllInputs(keyPair);
  psbt.validateSignaturesOfAllInputs(validator);
  psbt.finalizeAllInputs();

  const tx = psbt.extractTransaction();
  const body = tx.toHex();

  const link = getBaseURL({testnet}) + '/tx';

  const response = await fetch(link, {method: 'post', body});
  const text = await response.text();

  const hexRegex = /^(0x|0X)?[a-fA-F0-9]+$/;
  const sent = hexRegex.test(text);

  if (!sent) throw new Error(text);

  return {transactionId: text, amount};
};

const getBtcNetwork = ({testnet = false}: NetworkOnly) => {
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
  txid,
  testnet = false,
}: GetTxHash): Promise<string> => {
  const link = getBaseURL({testnet}) + `/tx/${txid}/hex`;

  const response = await fetch(link);
  const data = await response.text();

  return data;
};

export const parseBTC = (btc: number) => {
  return (btc * Math.pow(10, 8)) | 0;
};

export const satoshiToBtc = (satoshi: number) => {
  return satoshi / Math.pow(10, 8);
};

export const generateMnemonic = () => {
  return bip39.generateMnemonic(256);
};

export const mnemonicToEntropy = ({mnemonic}: MnemonicOnly) => {
  return bip39.mnemonicToEntropy(mnemonic);
};

export const entropyToMnemonic = ({entropy}: EntropyOnly) => {
  return bip39.entropyToMnemonic(entropy);
};

export const generateXPubKeyFromMnemonic = async ({
  mnemonic,
  testnet = false,
}: MnemonicOnly): Promise<string> => {
  const network = getBtcNetwork({testnet});

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed, network);
  return node.neutered().toBase58();
};

export const generateXPrvKeyFromMnemonic = async ({
  mnemonic,
  testnet = false,
}: MnemonicOnly): Promise<string> => {
  const network = getBtcNetwork({testnet});

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed, network);
  return node.toBase58();
};

export const createBtcAddress = ({
  testnet = false,
}: CreateAddress): Wallet => {
  const network = getBtcNetwork({testnet});
  const keyPair = ECPair.makeRandom({network});
  const {address} = bitcoin.payments.p2wpkh({
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
  const root = bip32.fromSeed(seed, network);

  const path = getPath(index);
  const child = root.derivePath(path);

  const {address} = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network,
  });

  return {
    address,
    privateKey: child.privateKey.toString(),
    wif: child.toWIF(),
  };
};

export const createBtcAddressFromHDKey = ({
  hdkey,
  index,
  testnet = false,
}: CreateAddressFromHDKey): Wallet => {
  const network = getBtcNetwork({testnet});

  const path = getPath(index);
  const {address} = bitcoin.payments.p2wpkh({
    pubkey: bip32.fromBase58(hdkey, network).derivePath(path).publicKey,
    network,
  });
  if (hdkey.includes('prv')) {
    const root = bip32.fromBase58(hdkey, network);

    const child = root.derivePath(path);

    return {
      address,
      privateKey: child.privateKey.toString(),
      wif: child.toWIF(),
    };
  } else {
    return {address, privateKey: undefined, wif: undefined};
  }
};

export const importBtcAddress = ({
  wif,
  testnet = false,
}: ImportAddress): Wallet => {
  const network = getBtcNetwork({testnet});

  const keyPair = ECPair.fromWIF(wif, network);
  const {address} = bitcoin.payments.p2wpkh({
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
  let link = getBaseURL({testnet});
  link += `/address/${address}/utxo`;

  let response = await fetch(link);
  let data: any;
  let satoshi: number;
  if (response.status === 200) {
    data = await response.json();
    satoshi = 0;
    for (let index = 0; index < data.length; index++) {
      const utxo = data[index];
      satoshi += utxo.value;
    }
  } else {
    link = testnet ?
      `http://api.blockcypher.com/v1/btc/test3/addrs/${address}` :
      `https://blockchain.info/address/${address}?format=jsonrawaddr`;
    response = await fetch(link);
    data = await response.json();
    satoshi = parseInt(data.final_balance.toString());
  }
  const btc: number = satoshiToBtc(satoshi);

  return {satoshi, btc};
};

export const estimateFee = async ({
  wif,
  addresses,
  amounts,
  testnet = false,
}: EstimateFee): Promise<Amount> => {
  const network = getBtcNetwork({testnet});

  const {address: sender}: Wallet = importBtcAddress({
    wif,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  return estimateBtcFee({
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
  fee = null,
  testnet = false,
}: Send): Promise<TransactionReceipt> => {
  const network = getBtcNetwork({testnet});

  const {address: sender}: Wallet = importBtcAddress({
    wif,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  if (!fee) {
    const {satoshi} = await estimateFee({wif, addresses, amounts, testnet});
    fee = satoshi;
  }

  return sendBtc({addresses, amounts, fee, keyPair, testnet, sender});
};

export const sendWithHDKey = async ({
  xprv,
  addresses,
  amounts,
  index,
  fee,
  testnet = false,
}: SendWithHD): Promise<TransactionReceipt> => {
  const network = getBtcNetwork({testnet});

  const {address: sender, wif}: Wallet = createBtcAddressFromHDKey({
    hdkey: xprv,
    index,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  if (!fee) {
    const {satoshi} = await estimateFee({wif, addresses, amounts, testnet});
    fee = satoshi;
  }

  return sendBtc({addresses, amounts, fee, keyPair, testnet, sender});
};

export const sendWithMnemonic = async ({
  mnemonic,
  addresses,
  amounts,
  index,
  fee,
  testnet = false,
}): Promise<TransactionReceipt> => {
  const network = getBtcNetwork({testnet});

  const {address: sender, wif}: Wallet = createBtcAddressFromMnemonic({
    mnemonic,
    index,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  if (!fee) {
    const {satoshi} = await estimateFee({wif, addresses, amounts, testnet});
    fee = satoshi;
  }

  return sendBtc({addresses, amounts, fee, keyPair, testnet, sender});
};

export const sendTransaction = async ({
  hash: body,
  testnet = false,
}: SendTransaction): Promise<TransactionReceipt> => {
  const link = getBaseURL({testnet}) + '/tx';

  const response = await fetch(link, {method: 'post', body});
  const text = await response.text();

  const hexRegex = /^(0x|0X)?[a-fA-F0-9]+$/;
  const sent = hexRegex.test(text);

  if (!sent) throw new Error(text);

  return {transactionId: text};
};

export const drain = async ({
  wif,
  to,
  minimumBalance = 5000,
  testnet = false,
}): Promise<TransactionReceipt> => {
  const network = getBtcNetwork({testnet});

  const {address: sender}: Wallet = importBtcAddress({
    wif,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  return drainBtc({minimumBalance, to, keyPair, testnet, sender});
};

export const drainWithHDKey = async ({
  xprv,
  to,
  index,
  minimumBalance = 5000,
  testnet = false,
}): Promise<TransactionReceipt> => {
  const network = getBtcNetwork({testnet});

  const {address: sender, wif}: Wallet = createBtcAddressFromHDKey({
    hdkey: xprv,
    index,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  return drainBtc({to, keyPair, testnet, sender, minimumBalance});
};

export const drainWithMnemonic = async ({
  mnemonic,
  to,
  index,
  minimumBalance = 5000,
  testnet = false,
}): Promise<TransactionReceipt> => {
  const network = getBtcNetwork({testnet});

  const {address: sender, wif}: Wallet = createBtcAddressFromMnemonic({
    mnemonic,
    index,
    testnet,
  });

  const keyPair = ECPair.fromWIF(wif, network);

  return drainBtc({to, keyPair, testnet, sender, minimumBalance});
};

export const getBtcTransactions = async ({
  address,
  testnet = false,
}: GetBalance): Promise<any> => {
  const link = getBaseURL({testnet}) + `/address/${address}/txs`;
  const response = await fetch(link);
  return response.json();
};

export const getBtcTransaction = async ({
  transactionId,
  testnet = false,
}: GetBtcTransaction): Promise<any> => {
  const link = getBaseURL({testnet}) + `/tx/${transactionId}`;
  const response = await fetch(link);
  return response.json();
};
