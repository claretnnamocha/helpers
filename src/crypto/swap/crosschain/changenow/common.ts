import {getApiKey, request} from './_shared';

export const listAvailableCurrencies = async (fixedRate = true) => {
  return request({
    url: `currencies?active=true&fixedRate=${fixedRate}`,
    method: 'get',
  });
};

export const listAvailableCurrenciesForSpecificCurrency = async (body: {
  currency: string;
  fixedRate?: boolean;
}) => {
  const {currency, fixedRate = true} = body;
  return request({
    url: `currencies-to/${currency}?fixedRate=${fixedRate}`,
    method: 'get',
  });
};

export const currencyInfo = async (body: { currency: string }) => {
  const {currency} = body;
  return request({
    url: `currencies/${currency}`,
    method: 'get',
  });
};

export const listOfTransactions = async (body: {
  from: string;
  to: string;
  status:
    | 'new'
    | 'waiting'
    | 'confirming'
    | 'exchanging'
    | 'sending'
    | 'finished'
    | 'failed'
    | 'refunded'
    | 'verifying';
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const {
    from,
    to,
    status,
    page = 1,
    pageSize = 50,
    dateFrom = '',
    dateTo = '',
  } = body;
  let url =
    `transactions/${getApiKey()}?from=${from}&to=${to}&` +
    `status=${status}&limit=${pageSize}&offset=${(page - 1) * pageSize}`;

  if (dateFrom) url += `&dateFrom=${dateFrom}`;

  if (dateTo) url += `&dateTo=${dateTo}`;

  return request({
    url,
    method: 'get',
  });
};

export const transactionStatus = async (body: { transactionId: string }) => {
  const {transactionId} = body;
  return request({
    url: `transactions/${transactionId}/${getApiKey()}`,
    method: 'get',
  });
};
