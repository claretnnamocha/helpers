export interface payload {
  [key: string]: any;
}

export interface generate {
  payload: payload;
  expiresIn?: string;
}
