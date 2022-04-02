import {ECPairInterface} from 'ecpair';
import {Transaction} from 'bitcoinjs-lib';

export interface GetBalance {
  testnet?: boolean;
  address: string;
}

export interface ImportAddress {
  wif: string;
  testnet?: boolean;
}

export interface CreateAddress {
  testnet?: boolean;
}

export interface TransactionReceipt {
  transactionId: string;
}

export interface Amount {
  satoshi: number;
  btc: number;
}

export interface Wallet {
  wif: string;
  address: string;
  privateKey: string;
}

export interface EstimateFeeWithHD {
  xpub: string;
  index: number;
  xprv: string;
  testnet?: boolean;
  amounts: Array<number>;
  addresses: Array<string>;
}

export interface EstimateFee {
  testnet?: boolean;
  amounts: Array<number>;
  addresses: Array<string>;
  wif: string;
}

export interface Send extends EstimateFee {
  fee?: number;
}

interface UTXOStatus {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
}

export interface UTXO {
  txid?: string;
  vout?: number;
  value?: number;
  status?: UTXOStatus;
}

export interface Send extends EstimateFee {
  fee?: number;
}

export interface SendBTC {
  amounts: Array<number>;
  addresses: Array<string>;
  fee: number;
  sender: string;
  keyPair: ECPairInterface;
  testnet?: boolean;
}

export interface SendWithHD extends EstimateFeeWithHD {
  fee?: number;
}

export interface ImportAddressFromMnemonic {
  mnemonic: string;
  index: number;
  testnet?: boolean;
}

export interface MnemonicOnly {
  mnemonic: string;
  testnet?: boolean;
}

export interface AddressOnly {
  address: string;
}

export interface EntropyOnly {
  entropy: string;
}

export interface CreateAddressFromXPub {
  xpub: string;
  index: number;
  testnet?: boolean;
}

export interface GatherUTXOS {
  testnet?: boolean;
  utxos: Array<UTXO>;
}

export interface GetTxHash {
  testnet?: boolean;
  txid: string;
}

export interface NetworkOnly {
  testnet?: boolean;
}

export interface CalculateTxFee {
  testnet?: boolean;
  tx: Transaction;
}
