import fetch from "node-fetch";
import { v4 as uuid } from "uuid";
import { payments } from "../types";

const { COINGATE_BASEURL, COINGATE_CALLBACK_URL, COINGATE_APIKEY } =
  process.env;

export const initiateTransaction = async (
  params: payments.initiateTransaction
) => {
  const order_id = uuid();

  let response: any = await fetch(`${COINGATE_BASEURL}/orders`, {
    method: "post",
    body: JSON.stringify({
      order_id,
      price_amount: params.amount,
      price_currency: "ngn",
      receive_currency: "ngn",
      callback_url: COINGATE_CALLBACK_URL,
    }),
    headers: {
      Authorization: COINGATE_APIKEY,
      "content-type": "application/json",
    },
  });

  const order = await response.json();

  if (!order.id) {
    return false;
  }

  response = await fetch(`${COINGATE_BASEURL}/orders/${order.id}/checkout`, {
    method: "post",
    body: JSON.stringify({ pay_currency: params.metadata.currency }),
    headers: {
      Authorization: COINGATE_APIKEY,
      "content-type": "application/json",
    },
  });

  const checkOut: any = await response.json();

  if (!checkOut.id) {
    return false;
  }

  // todo: handle payments init checkOut object
  //   {
  //     "id": int,
  //     "order_id": string,
  //     "pay_amount": string (number),
  //     "pay_currency": string,
  //     "payment_address": string,
  //     "payment_url": string,
  //     "price_amount": string (number),
  //     "price_currency": "ngn",
  //     "receive_amount": string (number),
  //     "receive_currency": "ngn",
  //     "status": "pending",
  // }
};

export const handleWebhook = (params: payments.webhook) => {
  const { body } = params;

  const payload = body;

  return payload;
};
