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
