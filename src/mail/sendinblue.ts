import {generateReciepient} from '.';
import {mail} from '../types';

export const send = async ({
  to,
  subject,
  text = '',
  html = '',
  from = '',
  fromName = '',
}: mail.send) => {
  const {SENDINBLUE_API_KEY, EMAIL_FROM, EMAIL_NAME} = process.env;
  try {
    const body = {
      sender: {name: fromName || EMAIL_NAME, email: from || EMAIL_FROM},
      to: generateReciepient(to),
      subject,
      htmlContent: html,
      textContent: text,
    };

    const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
      method: 'post',
      headers: {
        'api-key': SENDINBLUE_API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.status === 201;
  } catch (error) {
    return false;
  }
};
