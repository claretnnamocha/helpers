type network = 'mainnet' | 'shasta' | 'nile';

export interface GetBalance {
  network?: network;
  address: string;
}

export interface GetERC20Balance {
  network?: network;
  address: string;
  contractAddress: string;
  decimals: number;
}

export interface GetTransaction {
  network?: network;
  hash: string;
}

export interface ImportAddress {
  privateKey: string;
}

export interface Network {
  network?: network;
}

export interface Transaction {
  trxid: string;
}

export interface Amount {
  sun: number;
  trx: number;
}

export interface Wallet {
  address: string;
  privateKey: string;
}

export interface SendTrx {
  network?: network;
  amount?: number;
  address: string;
  privateKey: string;
  backer?: string;
  fee?: number;
}

export interface SendTrc20 extends SendTrx {
  decimals: number;
  contractAddress: string;
}

export interface ImportAddressFromMnemonic {
  mnemonic: string;
  index: number;
}

export interface ImportAddressFromHDKey {
  hdkey: string;
  index: number;
}

export interface MnemonicOnly {
  mnemonic: string;
}
