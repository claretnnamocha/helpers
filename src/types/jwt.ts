export interface payload {
  [key: string]: any;
}

export interface verify {
  secret?: string;
  token: string;
}

export interface generate {
  payload: payload;
  expiresIn?: string;
  secret?: string;
}
