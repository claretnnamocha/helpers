import { RequestInit } from "node-fetch";

export interface request extends RequestInit {
  url: string;
  returns?: string;
  query?: string;
}
