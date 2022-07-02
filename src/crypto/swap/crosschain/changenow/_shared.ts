import fetch from 'node-fetch';

const BASE_URL = 'https://api.changenow.io';

export const getApiKey = () => {
  const {CHANGENOW_API_KEY} = process.env;
  return CHANGENOW_API_KEY;
};

export const request = async ({url, body = {}, method, prefix = '/v1'}) => {
  try {
    let headers: any = {'content-type': 'application/json'};

    if (prefix === '/v2') {
      headers = {...headers, 'x-changenow-api-key': getApiKey()};
    }

    let response: any = await fetch(`${BASE_URL + prefix}/${url}`, {
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      method,
      headers,
    });
    response = await response.json();

    return response;
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling changenow.io',
    };
  }
};
