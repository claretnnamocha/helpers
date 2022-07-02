import fetch from 'node-fetch';
import {sms} from '../types';
const url = 'https://api.ng.termii.com/api';

export const send = async ({to, body: sms, from = 'Termii'}: sms.send) => {
  const {TERMII_API_KEY: api_key} = process.env;

  try {
    const response = await fetch(`${url}/sms/send`, {
      method: 'POST',
      body: JSON.stringify({
        api_key,
        to,
        from,
        sms,
        type: 'plain',
        channel: 'dnd',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200;
  } catch (error) {
    return false;
  }
};
