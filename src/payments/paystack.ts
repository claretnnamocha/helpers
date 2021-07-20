import crypto from "crypto";
import { payments } from "../types";

const { PAYSTACK_SECRET_KEY } = process.env;
export * as api from "paystack-node";

export const handleWebhook = (params: payments.webhook) => {
  const { headers, body } = params;

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== headers["x-paystack-signature"]) {
    return false;
  }

  const payload = body;

  return payload;
};
