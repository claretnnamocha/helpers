import {request} from '../_shared';

export const createExchangeTransaction = async (body: {
  from_amount: number;
  from_currency;
  to_currency;
  payout_address;
  from_network?: string;
  to_network?: string;
  payout_extra_id?: string;
  deposit_type?:
    | 'SEPA_1'
    | 'VISA_MC1'
    | 'VISA_MC2'
    | 'LUQAPAY'
    | 'CRYPTO_THROUGH_CN';
  payout_type:
    | 'SEPA_1'
    | 'VISA_MC1'
    | 'VISA_MC2'
    | 'LUQAPAY'
    | 'CRYPTO_THROUGH_CN';
}) => {
  body.from_network = body.from_network || '';
  body.to_network = body.to_network || '';
  body.payout_extra_id = body.payout_extra_id || '';
  body.deposit_type = body.deposit_type || 'SEPA_1';
  body.payout_type = body.payout_type || 'SEPA_1';

  return request({
    url: `fiat-transaction`,
    method: 'post',
    prefix: '/v2',
    body,
  });
};

export const transactionStatus = async (body: { id: string }) => {
  const {id} = body;
  return request({
    url: `fiat-status/?id=${id}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const estimate = async (body: {
  from_currency: string;
  from_amount: string;
  to_currency: string;
  from_network?: string;
  to_network?: string;
  deposit_type?: string;
  payout_type?: string;
}) => {
  const {
    from_currency,
    from_amount,
    to_currency,
    from_network = '',
    to_network = '',
    deposit_type = '',
    payout_type = '',
  } = body;
  return request({
    url:
      `fiat-estimate?from_currency=${from_currency}` +
      `&from_network=${from_network}` +
      `&from_amount=${from_amount}&to_currency=${to_currency}` +
      `&to_network=${to_network}&deposit_type=${deposit_type}` +
      `&payout_type=${payout_type}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const marketInfo = async (body: { from: string; to: string }) => {
  const {from, to} = body;
  return request({
    url: `fiat-market-info/min-max-range/${from}_${to}`,
    method: 'get',
    prefix: '/v2',
  });
};

export const healthCheck = async () => {
  return request({
    url: `fiat-status`,
    method: 'get',
    prefix: '/v2',
  });
};

export const fiatCurrencies = async () => {
  return request({
    url: `fiat-currencies/fiat`,
    method: 'get',
    prefix: '/v2',
  });
};

export const cryptoCurrencies = async () => {
  return request({
    url: `fiat-currencies/crypto`,
    method: 'get',
    prefix: '/v2',
  });
};
