import crypto from "crypto";
import fetch from "node-fetch";

import { payments } from "../types";

const { PAYSTACK_SECRET_KEY } = process.env;

const baseURL = "https://api.paystack.co";

const request = async ({ url, body = {}, method = "get" }) => {
  try {
    let response: any = await fetch(`${baseURL}/${url}`, {
      body: Object.keys(body).length ? JSON.stringify(body) : null,
      method,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
      },
    });

    response = await response.json();

    return response;
  } catch (error) {
    return {
      status: false,
      message: "An error occured calling paystack"
    };
  }
};

export const initiateTransaction = (params: payments.initiateTransaction) => {
  // todo: handle payments init
};

export const getBanks = async () =>
  await request({ url: "bank?country=nigeria&use_cursor=false" });

export const resolveBank = async ({ account_number, bank_code }) =>
  await request({
    url: `bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
  });

export const transfer = async ({
  name,
  account_number,
  bank_code,
  amount,
  reason,
}) => {
  const {
    status: trs,
    message: trm,
    data: trd,
  } = await request({
    url: `transferrecipient`,
    body: {
      type: "nuban",
      name,
      account_number,
      bank_code,
      currency: "NGN",
    },
    method: "post",
  });
  if (!trs) return { status: trs, message: trm };

  const { recipient_code: recipient } = trd;
  amount = amount * 1000;

  const { status, message, data } = await request({
    url: `transfer`,
    body: {
      source: "balance",
      reason,
      amount,
      recipient,
    },
    method: "post",
  });

  return { status, message, data };
};

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
