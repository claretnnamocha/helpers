import {getApiKey, request} from './_shared';

export const estimateExchangeAmount = async (body: {
  amount: number;
  from: string;
  to: string;
}) => {
  const {amount, from, to} = body;
  return request({
    url: `exchange-amount/${amount}/${from}_${to}/?api_key=${getApiKey()}`,
    method: 'get',
  });
};

export const createExchangeTransaction = async (body: {
  from: string;
  to: string;
  address: string;
  amount: string;
  refundAddress?: string;
}) => {
  body.refundAddress = body?.refundAddress || body.address;

  return request({
    url: `transactions/${getApiKey()}`,
    method: 'post',
    body,
  });
};

export const listOfAllAvailablePairs = async (includePartners = false) => {
  return request({
    url: `market-info/available-pairs/?includePartners=${includePartners}`,
    method: 'get',
  });
};

export const minimalExchangeAmount = async (body: {
  from: string;
  to: string;
}) => {
  const {from, to} = body;
  return request({
    url: `min-amount/${from}_${to}?api_key=${getApiKey()}`,
    method: 'get',
  });
};

export const exchangeRange = async (body: { from: string; to: string }) => {
  const {from, to} = body;
  return request({
    url: `exchange-range/${from}_${to}?api_key=${getApiKey()}`,
    method: 'get',
  });
};
