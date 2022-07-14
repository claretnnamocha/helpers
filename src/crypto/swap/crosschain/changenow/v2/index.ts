import {request} from '../_shared';

export const listAvailableCurrencies = async (body: {
  buy: boolean;
  sell: boolean;
}) => {
  const {buy = null, sell = null} = body;
  return request({
    url:
      `exchange/currencies?active=&flow=standard` +
      `&buy=${buy || ''}&sell=${sell || ''}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const minimalExchangeAmount = async (body: {
  from: string;
  to: string;
  fromNetwork: string;
  toNetwork: string;
  flow: 'standard' | 'fixed-rate';
}) => {
  const {from, to, fromNetwork, toNetwork, flow = 'standard'} = body;
  return request({
    url:
      `exchange/min-amount?fromCurrency=${from}&toCurrency=${to}` +
      `&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=${flow}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const listAllAvailablePairs = async (body: {
  from?: string;
  to?: string;
  fromNetwork?: string;
  toNetwork?: string;
  flow?: 'standard' | 'fixed-rate';
}) => {
  const {from, to, fromNetwork, toNetwork, flow = 'standard'} = body;
  return request({
    url:
      `exchange/available-pairs?fromCurrency=${from}&toCurrency=${to}` +
      `&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=${flow}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const exchangeRange = async (body: {
  from?: string;
  to?: string;
  fromNetwork?: string;
  toNetwork?: string;
  flow?: 'standard' | 'fixed-rate';
}) => {
  const {from, to, fromNetwork, toNetwork, flow = 'standard'} = body;
  return request({
    url:
      `exchange/range?fromCurrency=${from}&toCurrency=${to}&` +
      `fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=${flow}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const estimatedExchangeAmount = async (body: {
  from: string;
  to: string;
  fromAmount: number;
  toAmount: number;
  fromNetwork?: string;
  toNetwork?: string;
  flow?: 'standard' | 'fixed-rate';
  type?: 'direct' | 'reverse';
  useRateId?: boolean;
}) => {
  const {
    from,
    to,
    fromAmount,
    toAmount,
    fromNetwork = '',
    toNetwork = '',
    flow = 'standard',
    type = 'direct',
    useRateId,
  } = body;
  return request({
    url:
      `exchange/estimated-amount?fromCurrency=${from}&` +
      `toCurrency=${to}&fromAmount=${fromAmount}&toAmount=${toAmount}&` +
      `fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=${flow}&` +
      `type=${type}&useRateId=${useRateId}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const createExchangeTransaction = async (body: {
  fromCurrency: string;
  fromNetwork: string;
  toCurrency: string;
  toNetwork: string;
  fromAmount: string;
  toAmount: string;
  address: string;
  extraId?: string;
  refundAddress?: string;
  refundExtraId?: string;
  userId?: string;
  payload?: string;
  contactEmail?: string;
  flow?: 'standard' | 'fixed-rate';
  type?: 'direct' | 'reverse';
  rateId?: string;
}) => {
  return request({
    url: `exchange`,
    method: 'post',
    prefix: '/v2',
    body,
  });
};

export const transactionStatus = async (body: { id: string }) => {
  const {id} = body;
  return request({
    url: `exchange/by-id?id=${id}`,
    method: 'get',
    prefix: '/v2',
    body,
  });
};

export const addressValidation = async (body: {
  currency: string;
  address: string;
}) => {
  const {currency, address} = body;
  return request({
    url: `validate/address?currency=${currency}&address=${address}`,
    method: 'get',
    prefix: '/v2',
    body,
  });
};

export const userAddresses = async (body: { name: string }) => {
  const {name} = body;
  return request({
    url: `addresses-by-name?name=${name}`,
    method: 'get',
    prefix: '/v2',
    body,
  });
};

export const estimatedExchangeNetworkFee = async (body: {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  fromNetwork?: string;
  toNetwork?: string;
  convertedCurrency?: string;
  convertedNetwork?: string;
}) => {
  const {
    fromCurrency,
    toCurrency,
    fromAmount,
    fromNetwork = '',
    toNetwork = '',
    convertedCurrency = '',
    convertedNetwork = '',
  } = body;
  return request({
    url:
      `exchange/network-fee?fromCurrency=${fromCurrency}` +
      `&toCurrency=${toCurrency}&fromNetwork=${fromNetwork}` +
      `&toNetwork=${toNetwork}&fromAmount=${fromAmount}` +
      `&convertedCurrency=${convertedCurrency}` +
      `&convertedNetwork=${convertedNetwork}`,
    method: 'get',
    prefix: '/v2',
    body,
  });
};

export const marketEstimateFiatCryptoToCrypto = async (body: {
  fromCurrency: string;
  toCurrency: string;
  fromAmount?: number;
  toAmount?: number;
  type?: 'direct' | 'reverse';
}) => {
  const {
    fromCurrency,
    toCurrency,
    fromAmount = 0,
    toAmount = 0,
    type = 'direct',
  } = body;
  return request({
    url:
      `markets/estimate?fromCurrency=${fromCurrency}` +
      `&toCurrency=${toCurrency}` +
      `&fromAmount=${fromAmount || ''}` +
      `&toAmount=${toAmount || ''}&type=${type}`,
    method: 'get',
    prefix: '/v2',
    body,
  });
};

export const exchanges = async (body: {
  limit: number;
  offset: number;
  sortDirection: 'ASC' | 'DESC';
  sortField: 'createdAt' | 'updatedAt';
  dateField: 'createdAt' | 'updatedAt';
  dateFrom: string;
  dateTo: string;
  requestId: string;
}) => {
  const {
    limit,
    offset,
    sortDirection,
    sortField,
    dateField,
    dateFrom,
    dateTo,
    requestId,
  } = body;
  return request({
    url:
      `exchanges?limit=${limit}&offset=${offset}` +
      `&sortDirection=${sortDirection}&sortField=${sortField}` +
      `&dateField=${dateField}&dateFrom=${dateFrom}&dateTo=${dateTo}` +
      `&requestId=${requestId}`,
    method: 'get',
    prefix: '/v2',
    body,
  });
};

export * as fiat from './fiat';
