export interface AssetBalance {
  asset: string;
  blockchain: string;
  network: string;
}

export interface AppWallets {
  asset?: string;
  blockchain?: string;
  network?: string;
  page: number;
  pageSize: number;
}

export interface GetWallet {
  walletId?: string;
}

export interface Transactions extends AppWallets {
  type?: string;
}

export interface Paginate {
  page: number;
  pageSize: number;
}

export interface GenerateBitcoinAddress {
  amount: number;
  expiryInMinutes: number;
  network: string;
  contactEmail: number;
  contactPhone?: number;
  contactName?: number;
}

export interface GenerateEthereumAddress extends GenerateBitcoinAddress {
  asset: string;
}
