export interface webhook {
  body: any;
  headers: object;
}

export interface initiateTransaction {
  userId: string;
  wallet: string;
  metadata: any;
  description: string;
  type: string;
  amount: number;
}
