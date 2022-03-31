export interface send {
  to: string | Array<string>;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  fromName?: string;
}
