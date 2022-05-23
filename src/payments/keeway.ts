import fetch from 'node-fetch';

const baseURL = 'https://keeway-link.herokuapp.com/api/v1/blockchain';

const request = async ({url, body = {}, method = 'get'}) => {
  const {KEEWAY_SECRET_KEY} = process.env;

  try {
    return await fetch(`${baseURL}/${url}`, {
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      method,
      headers: {
        'authorization': `Bearer ${KEEWAY_SECRET_KEY}`,
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling keeway',
    };
  }
};

export const assetsBalances = async () =>
  request({url: `assets-balances`, method: 'get'});

export const assetBalance = async ({asset, blockchain, network}) =>
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
}) =>
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
}) =>
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
