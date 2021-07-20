import { v4 as uuid } from "uuid";
import request from '../request'
import { payments } from "../types";

const { COINGATE_CALLBACK_URL, COINGATE_APIKEY } = process.env;

export const initiateTransaction = (
  params: payments.initiateCoingateTransaction
) => {
  const { sandbox = false } = params;

  const order_id = uuid();
  const COINGATE_BASEURL = sandbox
    ? "https://api-sandbox.coingate.com/v2"
    : "https://api.coingate.com/v2";

  const order: any = request(
    `${COINGATE_BASEURL}/orders`,
    "post",
    {
      order_id,
      price_amount: params.amount,
      price_currency: "ngn",
      receive_currency: "ngn",
      callback_url: COINGATE_CALLBACK_URL,
    },
    { Authorization: COINGATE_APIKEY }
  );

  if (!order.id) {
    return false;
  }

  const checkOut: any = request(
    `${COINGATE_BASEURL}/orders/${order.id}/checkout`,
    "post",
    { pay_currency: params.metadata.currency },
    { Authorization: COINGATE_APIKEY }
  );

  if (!checkOut.id) {
    return false;
  }
  return checkOut;
};
