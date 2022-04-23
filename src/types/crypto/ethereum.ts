import {TransactionResponse} from '@ethersproject/providers';

type network =
  | 'homestead'
  | 'rinkeby'
  | 'ropsten'
  | 'kovan'
  | 'palm-mainnet'
  | 'palm-testnet'
  | 'polygon-mainnet'
  | 'polygon-mumbai'
  | 'bsc'
  | 'bsc-testnet';

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
  network?: network;
}
export interface Network {
  network?: network;
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
  network?: network;
  amount: number;
  address: string;
  privateKey: string;
}

export interface SendErc20 {
  network?: network;
  amount: number;
  decimals: number;
  address: string;
  contractAddress: string;
  privateKey: string;
}

export interface ImportAddressFromMnemonic {
  mnemonic: string;
  index: number;
}

export interface ImportAddressFromXPrv {
  xprv: string;
  index: number;
}

export interface MnemonicOnly {
  mnemonic: string;
}

export interface DrainEth {
  network?: network;
  address: string;
  privateKey: string;
}

export interface DrainErc20 {
  network?: network;
  address: string;
  contractAddress: string;
  privateKey: string;
  gasSupplierPrivateKey?: string;
}

export interface DrainResponse {
  transaction?: TransactionResponse;
  fee?: number;
}
