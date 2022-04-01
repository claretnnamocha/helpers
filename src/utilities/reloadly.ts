import fetch from 'node-fetch';

const {RELOADLY_CLIENT_ID, RELOADLY_CLIENT_SECRET} = process.env;

const auth = async () => {
  let response: any = await fetch('https://auth.reloadly.com/oauth/token', {
    method: 'post',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      client_id: RELOADLY_CLIENT_ID,
      client_secret: RELOADLY_CLIENT_SECRET,
      grant_type: 'client_credentials',
      audience: 'https://topups.reloadly.com',
    }),
  });

  response = await response.json();

  return response;
};

export const request = async ({url, method, body = null}) => {
  try {
    if (body) {
      body = JSON.stringify(body);
    }
    const {access_token}: any = await auth();

    let response: any = await fetch(`https://topups.reloadly.com/${url}`, {
      method,
      headers: {
        'authorization': `Bearer ${access_token}`,
        'content-type': 'application/json',
      },
      body,
    });

    response = await response.json();

    return response;
  } catch (error) {
    return {
      status: false,
      message: 'An error occured calling reloadly',
    };
  }
};
