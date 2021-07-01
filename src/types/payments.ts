export interface webhook {
  body: any;
  headers: object;
}

export interface initiateTransaction {
  currency: string;
  wallet: string;
  metadata: any;
  description: string;
  type: string;
  amount: number;
}

export interface initiateCoingateTransaction extends initiateTransaction {
  sandbox: boolean;
}
