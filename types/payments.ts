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

export interface resolveBank {
  account_number: string;
  bank_code: string;
}

export interface resolveBVN {
  bvn: string;
}

export interface resolveCardBin {
  bin: string;
}

export interface transfer {
  account_number: number;
  name?: string;
  bank_code: string;
  amount: number;
  reason: string;
}
