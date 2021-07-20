import { payments } from "../types";

const { FLUTTERWAVE_HASH } = process.env;

export * as api from "flutterwave-node";

export const handleWebhook = (params: payments.webhook) => {
  const { headers, body } = params;

  if (headers["verif-hash"] !== FLUTTERWAVE_HASH) {
    return false;
  }

  const payload = JSON.parse(body);

  return payload;
};
