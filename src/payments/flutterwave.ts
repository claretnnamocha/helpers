import fetch from 'node-fetch';
import {v4 as uuid} from 'uuid';
import {payments} from '../types';

const baseURL = 'https://api.flutterwave.com/v3';

const request = async ({url, body = {}, method = 'get'}) => {
  const {FLUTTERWAVE_SECRET_KEY} = process.env;

  try {
    let response: any = await fetch(`${baseURL}/${url}`, {
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      method,
      headers: {
        'authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'content-type': 'application/json',
      },
    });

    response = await response.json();
    response.status = response.status === 'success';

    return response;
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling flutterwave',
    };
  }
};

export const getBanks = async () => {
  const response = await request({url: 'banks/NG'});
  return response;
};

export const resolveBank = async ({
  account_number,
  bank_code: account_bank,
}: payments.resolveBank) =>
  request({
    url: `accounts/resolve`,
    body: {account_number, account_bank},
    method: 'post',
  });

export const transfer = async ({
  account_number,
  bank_code: account_bank,
  amount,
  reason: narration,
}: payments.transfer) => {
  const response = await request({
    url: `transfers`,
    body: {
      account_bank,
      account_number,
      amount,
      narration,
      currency: 'NGN',
      reference: uuid(),
      debit_currency: 'NGN',
    },
    method: 'post',
  });

  return response;
};

export const handleWebhook = (params: payments.webhook) => {
  const {FLUTTERWAVE_HASH} = process.env;

  const {headers, body} = params;

  if (headers['verif-hash'] !== FLUTTERWAVE_HASH) {
    return false;
  }

  const payload = JSON.parse(body);

  return payload;
};

export const resolveBVN = async ({bvn}: payments.resolveBVN) =>
  request({
    url: `kyc/bvns/${bvn}`,
    method: 'get',
  });

export const resolveCardBin = async ({bin}: payments.resolveCardBin) =>
  request({
    url: `card-bins/${bin}`,
    method: 'get',
  });

export const fxRate = async ({amount, from, to}: payments.fxRate) =>
  request({
    url:
      `transfers/rates?amount=${amount}&destination_currency=` +
      `${to}&source_currency=${from}`,
    method: 'get',
  });
