import fetch from 'node-fetch';
import {v4 as uuid} from 'uuid';
import {payments} from '../types';

const baseURL = 'https://sandbox.monnify.com/api';

const auth = async () => {
  const {MONNIFY_API_KEY, MONNIFY_SECERET} = process.env;

  let response: any = await fetch(`${baseURL}/v1/auth/login`, {
    headers: {
      'authorization': `Basic ${Buffer.from(
          `${MONNIFY_API_KEY}:${MONNIFY_SECERET}`,
      ).toString('base64')}`,
      'content-type': 'application/json',
    },
    method: 'post',
  });

  response = await response.json();

  return response;
};

const request = async ({url, body = {}, method = 'get'}) => {
  try {
    const r = await auth();

    const {requestSuccessful} = r;

    if (requestSuccessful) {
      const {
        responseBody: {accessToken},
      } = r;

      let response: any = await fetch(`${baseURL}/${url}`, {
        method,
        headers: {
          'authorization': `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      });

      response = await response.json();

      response.status = response.requestSuccessful;
      response.data = response.responseBody;
      response.message = response.responseMessage;
      delete response.responseBody;
      delete response.responseMessage;
      delete response.requestSuccessful;
      delete response.responseCode;

      return response;
    }
    return {status: false, message: 'Monnify request failed'};
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling monnify',
    };
  }
};

export const reserveAccount = async ({name, email}) => {
  const {MONNIFY_CONTRACT_CODE} = process.env;

  return request({
    url: 'v2/bank-transfer/reserved-accounts',
    body: {
      accountReference: uuid(),
      accountName: `${name}'s Account`,
      currencyCode: 'NGN',
      contractCode: MONNIFY_CONTRACT_CODE,
      customerEmail: email,
      customerName: name,
      getAllAvailableBanks: true,
    },
    method: 'post',
  });
};

export const deallocateAccount = async ({reference}) =>
  await request({
    url: `v1/bank-transfer/reserved-accounts/reference/${reference}`,
    method: 'delete',
  });

export const getBanks = async () => await request({url: 'v1/banks'});

export const resolveBank = async ({
  account_number,
  bank_code,
}: payments.resolveBank) =>
  await request({
    url:
      `v1/disbursements/account/validate?accountNumber=${account_number}&` +
      `bankCode=${bank_code}`,
  });

export const transfer = async ({
  account_number: destinationAccountNumber,
  bank_code: destinationBankCode,
  amount,
  reason: narration,
}: payments.transfer) => {
  const {MONNIFY_WALLET_ACCOUNT_NUMBER} = process.env;

  return request({
    url: `v2/disbursements/single`,
    body: {
      amount,
      reference: uuid(),
      narration,
      destinationBankCode,
      destinationAccountNumber,
      currency: 'NGN',
      sourceAccountNumber: MONNIFY_WALLET_ACCOUNT_NUMBER,
    },
    method: 'post',
  });
};
