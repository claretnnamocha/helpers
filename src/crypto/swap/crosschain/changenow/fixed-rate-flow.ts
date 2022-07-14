import {getApiKey, request} from './_shared';

export const listOfAvailableFixedRateMarkets = async () => {
  return request({
    url: `market-info/fixed-rate/${getApiKey()}`,
    method: 'get',
  });
};

export const estimateFixedRateExchangeAmount = async (body: {
  amount: number;
  from: string;
  to: string;
  useRateId?: boolean;
}) => {
  const {amount, from, to, useRateId = true} = body;
  return request({
    url:
      `exchange-amount/fixed-rate/${amount}/${from}_${to}` +
      `?api_key=${getApiKey()}&useRateId=${useRateId}`,
    method: 'get',
  });
};

export const estimateFixedRateExchangeAmountReverse = async (body: {
  amount: number;
  from: string;
  to: string;
  useRateId?: boolean;
}) => {
  const {amount, from, to, useRateId = true} = body;
  return request({
    url:
      `exchange-deposit/fixed-rate/${amount}/${from}_${to}?` +
      `api_key=${getApiKey()}&useRateId=${useRateId}`,
    method: 'get',
  });
};

export const exchangeRangeFixedRate = async (body: {
  from: string;
  to: string;
  useRateId?: boolean;
}) => {
  const {from, to, useRateId = true} = body;
  return request({
    url:
      `exchange-range/fixed-rate/${from}_${to}?` +
      `api_key=${getApiKey()}&useRateId=${useRateId}`,
    method: 'get',
  });
};

export const createFixedRateExchange = async (body: {
  from: string;
  to: string;
  address: string;
  amount: string;
  refundAddress?: string;
}) => {
  return request({
    url: `transactions/fixed-rate/${getApiKey()}`,
    method: 'post',
    body,
  });
};

export const createReverseFixedRateExchange = async (body: {
  from: string;
  to: string;
  address: string;
  result: string;
  refundAddress?: string;
}) => {
  return request({
    url: `transactions/fixed-rate/from-result/${getApiKey()}`,
    method: 'post',
    body,
  });
};
