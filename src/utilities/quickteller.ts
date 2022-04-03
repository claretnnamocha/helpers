import fetch from 'node-fetch';

const baseURL = 'https://sandbox.interswitchng.com';

const auth = async () => {
  const {INTERSWITCH_CLIENT_ID, INTERSWITCH_SECRET} = process.env;

  let response: any = await fetch(`${baseURL}/passport/oauth/token`, {
    headers: {
      'authorization': `Basic ${Buffer.from(
          `${INTERSWITCH_CLIENT_ID}:${INTERSWITCH_SECRET}`,
      ).toString('base64')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
    }),
    method: 'post',
  });

  response = await response.json();

  return response;
};

const request = async ({url, body = {}, method = 'get'}) => {
  try {
    const {access_token} = await auth();

    let response: any = await fetch(`${baseURL}/api/v2/quickteller/${url}`, {
      method,
      headers: {
        'authorization': `InterswitchAuth ${access_token}`,
        'content-type': 'application/json',
      },
      body: Object.keys(body).length ? JSON.stringify(body) : null,
    });

    response = await response.json();
    if ('error' in response) {
      response.status = false;
      response.message = response.error.message;
      delete response.error;
      delete response.errors;
    }

    if ('code' in response) {
      response.status = true;

      delete response.code;
    }

    return response;
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling quickteller',
    };
  }
};

export const getCategories = async () => {
  return await request({url: 'categorys'});
};

export const getBillersInCategory = async ({id}) => {
  return await request({url: `categorys/${id}/billers`});
};

export const getBillerItems = async ({billerId}) => {
  return await request({url: `billers/${billerId}/paymentitems`});
};

export const verifyCustomer = async ({
  customerId,
  serviceId: paymentCode,
}) => {
  return await request({
    url: 'customers/validations',
    body: {customers: [{customerId, paymentCode}]},
  });
};

export const payBill = async ({
  customerId,
  amount,
  productId: paymentCode,
}) => {
  amount = amount * 100;
  const response = await request({
    url: '/payments/advices',
    body: {
      terminalId: 'UNKOWN',
      amount,
      customerId,
      paymentCode,
      requestReference: 'UNKOWN',
    },
    method: 'post',
  });

  return response;
};
