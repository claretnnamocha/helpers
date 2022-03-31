export interface GetBalance {
  testnet?: boolean;
  address: string;
}

export interface GetTrxnHash {
  testnet?: boolean;
  trxid: string;
}

export interface ImportAddress {
  privateKey: string;
  testnet?: boolean;
}
export interface Network {
  testnet?: boolean;
}

export interface Transaction {
  trxid: string;
}

export interface Amount {
  wei: number;
  ethers: number;
}

export interface Wallet {
  address: string;
  privateKey: string;
}

export interface SendEth {
  testnet?: boolean;
  amount: number;
  address: string;
  privateKey: string;
}

export interface ImportAddressFromMnemonic {
  mnemonic: string;
  index: number;
}

export interface ImportAddressFromXPrv{
  xprv: string;
  index: number;
}

export interface MnemonicOnly {
  mnemonic: string;
}
