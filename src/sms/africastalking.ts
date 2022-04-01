import fetch from 'node-fetch';
import {generateReciepient} from '.';
import {sms} from '../types';

const {
  AFRICASTALKING_APIKEY: apiKey,
  AFRICASTALKING_USERNAME: username,
  AFRICASTALKING_SENDER_ID,
  AFRICASTALKING_SANDBOX,
} = process.env;

export const send = async ({
  to,
  body: message,
  from = AFRICASTALKING_SANDBOX ? null : AFRICASTALKING_SENDER_ID,
}: sms.send) => {
  try {
    to = generateReciepient(to);
    const details = {username, message, from, to};

    let body: string | Array<string> = [];
    for (const property in details) {
      if (details.hasOwnProperty(property)) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        body.push(encodedKey + '=' + encodedValue);
      }
    }
    body = body.join('&');

    const response = await fetch(
      AFRICASTALKING_SANDBOX ?
        'https://api.sandbox.africastalking.com/version1/messaging' :
        `https://api.africastalking.com/version1/messaging`,
      {
        method: 'post',
        body,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
          apiKey,
        },
      },
    );

    return response.status === 201;
  } catch (error) {
    return false;
  }
};
