import { ECPairInterface } from "ecpair";

export interface GetBalance {
  testnet?: boolean;
  address: string;
}

export interface GetTrxnHash {
  testnet?: boolean;
  trxid: string;
}

export interface ImportAddress {
  wif: string;
  testnet?: boolean;
}

export interface CreateAddress {
  testnet?: boolean;
}

export interface Transaction {
  trxid: string;
}

export interface Amount {
  satoshi: number;
  btc: number;
}

export interface Wallet {
  wif: string;
  address: string;
  privateKey: string;
  keyPair: ECPairInterface;
}

export interface Send {
  testnet?: boolean;
  amount: number;
  address: string;
  wif: string;
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

export interface TrySend extends Send {
  fee?: number;
}
