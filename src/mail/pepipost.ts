import fetch from 'node-fetch';
import {mail} from '../types';

export const send = async ({
  to,
  subject,
  text,
  html = null,
  from = '',
  fromName = '',
}: mail.send) => {
  const {NETCORE_API, EMAIL_FROM, EMAIL_NAME} = process.env;

  try {
    const options = {
      method: 'POST',
      headers: {'api_key': NETCORE_API, 'content-type': 'application/json'},
      body: JSON.stringify({
        from: {email: from || EMAIL_FROM, name: fromName || EMAIL_NAME},
        subject,
        content: [{type: 'html', value: html}],
        personalizations: [{to: [{email: to}]}],
      }),
    };

    const response = await fetch(
        'https://api.pepipost.com/v5.1/mail/send',
        options,
    );

    return response.status === 202;
  } catch (error) {
    return false;
  }
};
