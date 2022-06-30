import fetch from 'node-fetch';
import {URLSearchParams} from 'url';
import * as keeway from '../types/payments/keeway';

const baseURL = 'https://keeway-link.herokuapp.com/api/v1/blockchain';

const request = async ({url, body = {}, method = 'get'}) => {
  const {KEEWAY_SECRET_KEY} = process.env;

  try {
    const response = await fetch(`${baseURL}/${url}`, {
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      method,
      headers: {
        'authorization': `Bearer ${KEEWAY_SECRET_KEY}`,
        'content-type': 'application/json',
      },
    });

    return response.json();
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling keeway',
    };
  }
};

export const assetsBalances = async () =>
  request({url: `assets-balances`, method: 'get'});

export const assetBalance = async ({
  asset,
  blockchain,
  network,
}: keeway.AssetBalance) =>
  request({
    url: `asset-balance?${new URLSearchParams({
      asset,
      blockchain,
      network,
    }).toString()}`,
    method: 'get',
  });

export const wallets = async ({
  asset,
  blockchain,
  network,
  page = 1,
  pageSize = 10,
}: keeway.AppWallets) =>
  request({
    url: `wallets?${new URLSearchParams(
        JSON.parse(
            JSON.stringify({
              asset,
              blockchain,
              network,
              page,
              pageSize,
            }),
        ),
    ).toString()}`,
    method: 'get',
  });

export const transactions = async ({
  asset,
  blockchain,
  network,
  type,
  page = 1,
  pageSize = 10,
}: keeway.Transactions) =>
  request({
    url: `transactionss?${new URLSearchParams(
        JSON.parse(
            JSON.stringify({
              asset,
              blockchain,
              network,
              type,
              page,
              pageSize,
            }),
        ),
    ).toString()}`,
    method: 'get',
  });

export const wallet = async ({walletId}: keeway.GetWallet) =>
  request({
    url: `wallet?${new URLSearchParams(
        JSON.parse(JSON.stringify({walletId})),
    ).toString()}`,
    method: 'get',
  });

export const customers = async ({page = 1, pageSize = 10}: keeway.Paginate) =>
  request({
    url: `customers?${new URLSearchParams(
        JSON.parse(JSON.stringify({page, pageSize})),
    ).toString()}`,
    method: 'get',
  });

export const generateBitcoinAddress = async ({
  amount,
  contactEmail,
  expiryInMinutes,
  network,
  contactName,
  contactPhone,
}: keeway.GenerateBitcoinAddress) =>
  request({
    url: `bitcoin/generate-address?${new URLSearchParams(
        JSON.parse(
            JSON.stringify({
              amount,
              contactEmail,
              expiryInMinutes,
              network,
              contactName,
              contactPhone,
            }),
        ),
    ).toString()}`,
    method: 'get',
  });

export const generateEthereumAddress = async ({
  amount,
  contactEmail,
  expiryInMinutes,
  network,
  contactName,
  contactPhone,
  asset,
}: keeway.GenerateEthereumAddress) =>
  request({
    url: `ethereum/generate-address?${new URLSearchParams(
        JSON.parse(
            JSON.stringify({
              amount,
              contactEmail,
              expiryInMinutes,
              network,
              contactName,
              contactPhone,
              asset,
            }),
        ),
    ).toString()}`,
    method: 'get',
  });

export const generateTronAddress = async ({
  amount,
  contactEmail,
  expiryInMinutes,
  network,
  contactName,
  contactPhone,
  asset,
}: keeway.GenerateEthereumAddress) =>
  request({
    url: `tron/generate-address?${new URLSearchParams(
        JSON.parse(
            JSON.stringify({
              amount,
              contactEmail,
              expiryInMinutes,
              network,
              contactName,
              contactPhone,
              asset,
            }),
        ),
    ).toString()}`,
    method: 'get',
  });
