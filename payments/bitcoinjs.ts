import * as bitcoin from "bitcoinjs-lib";
import { Network } from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import {mnemonicToSeedSync} from "bip39";
import BIP32Factory from "bip32";
import fetch from "node-fetch";
import * as ecc from "tiny-secp256k1";
import {
  Amount,
  CreateAddress,
  GetBalance,
  GetTrxnHash,
  ImportAddress,
  Send,
  Transaction,
  TrySend,
  UTXO,
  Wallet,
  ImportAddressFromMnemonic,
} from "../types/bitcoinjs";

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const getBtcNetwork = ({ testnet }): Network =>
  testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

const trySendBtc = async ({
  address,
  amount,
  testnet = false,
  fee,
  wif,
}: TrySend): Promise<string> => {
  const validator = (
    pubkey: Buffer,
    msghash: Buffer,
    signature: Buffer
  ): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

  const network = getBtcNetwork({ testnet });
  const { address: sender, privateKey }: Wallet = importBtcAddress({
    wif,
    testnet,
  });

  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey));

  const { satoshi: balance }: Amount = await getBtcBalance({
    address: sender,
    testnet,
  });

  if (amount > balance) throw new Error("Insufficient balance");

  const utxos: Array<UTXO> = await getUtxos({ address: sender, testnet });

  if (!utxos.length) throw new Error("Insufficient balance");

  const psbt = new bitcoin.Psbt({ network });
  let totalOutput = 0;

  for (let utxo of utxos) {
    const trxid = utxo.txid;
    const index = utxo.vout;
    totalOutput += utxo.value;
    let nonWitnessUtxo: string | Buffer = await getUtxosHash({
      trxid,
      testnet,
    });
    nonWitnessUtxo = Buffer.from(nonWitnessUtxo, "hex");

    psbt.addInput({
      hash: trxid,
      index,
      nonWitnessUtxo,
    });
  }

  psbt.addOutput({ address, value: amount });

  psbt.addOutput({ address: sender, value: balance - amount - fee });

  psbt.signAllInputs(keyPair);
  psbt.validateSignaturesOfAllInputs(validator);
  psbt.finalizeAllInputs();

  const trxhash = psbt.extractTransaction().toHex();

  const link = testnet
    ? "https://blockstream.info/testnet/api/tx"
    : "https://blockstream.info/api/tx";

  const response = await fetch(link, { method: "post", body: trxhash });
  return await response.text();
};

const getUtxos = async ({
  address,
  testnet = false,
}: GetBalance): Promise<Array<UTXO>> => {
  const link = testnet
    ? `https://blockstream.info/testnet/api/address/${address}/utxo`
    : `https://blockstream.info/api/address/${address}/utxo`;

  const response = await fetch(link);
  const data: any = await response.json();

  return data;
};

const getUtxosHash = async ({
  trxid,
  testnet = false,
}: GetTrxnHash): Promise<string> => {
  const link = testnet
    ? `https://blockstream.info/testnet/api/tx/${trxid}/hex`
    : `https://blockstream.info/api/tx/${trxid}/hex`;

  const response = await fetch(link);
  const data = await response.text();

  return data;
};

export const createBtcAddress = ({
  testnet = false,
}: CreateAddress): Wallet => {
  const network = getBtcNetwork({ testnet });
  const keyPair = ECPair.makeRandom({ network });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  });
  const wif = keyPair.toWIF();
  const privateKey = keyPair.privateKey.toString();

  return { wif, address, privateKey };
};

export const importBtcAddress = ({
  wif,
  testnet = false,
}: ImportAddress): Wallet => {
  const network = getBtcNetwork({ testnet });

  const keyPair = ECPair.fromWIF(wif, network);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  });

  const privateKey = keyPair.privateKey.toString();

  return { wif, address, privateKey };
};

export const estimateBtcMinerFee = async ({
  address,
  amount,
  testnet = false,
  wif,
}: Send): Promise<Amount> => {
  let response: string = await trySendBtc({
    address,
    amount,
    testnet,
    fee: 0,
    wif,
  });

  const regex = /\<\s\d+/;
  let match: any = response.match(regex);
  match = match.toString();
  const satoshi = parseInt(match.replace("< ", ""));
  const btc: number = satoshi / Math.pow(10, 8);

  return { satoshi, btc };
};

export const sendBtc = async ({
  address,
  amount,
  testnet = false,
  wif,
}: Send): Promise<Transaction> => {
  const { satoshi: fee }: Amount = await estimateBtcMinerFee({
    address,
    amount,
    testnet,
    wif,
  });

  const response: string = await trySendBtc({
    address,
    amount,
    testnet,
    fee,
    wif,
  });

  const hexRegex = /^(0x|0X)?[a-fA-F0-9]+$/;
  const sent = hexRegex.test(response);

  if (!sent) throw new Error(response);

  return { trxid: response };
};

export const getBtcBalance = async ({
  address,
  testnet = false,
}: GetBalance): Promise<Amount> => {
  const link = testnet
    ? `http://api.blockcypher.com/v1/btc/test3//addrs/${address}`
    : `https://blockchain.info/address/${address}?format=jsonrawaddr`;
  const response = await fetch(link);
  const data: any = await response.json();
  const satoshi: number = data.final_balance;
  const btc: number = satoshi / Math.pow(10, 8);

  return { satoshi, btc };
};

export const createBtcAddressFromMnemonic = ({
  mnemonic,
  index,
  testnet = false,
}: ImportAddressFromMnemonic): Wallet => {
  const network = getBtcNetwork({ testnet });

  const seed = mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const path = `m/49'/1'/0'/0/${index}`;
  const child = root.derivePath(path);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network,
  });

  return {
    address,
    privateKey: child.privateKey.toString(),
    wif: child.toWIF(),
  };
};
