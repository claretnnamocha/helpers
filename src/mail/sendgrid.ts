import fetch from 'node-fetch';
import {generateReciepient} from '.';
import {mail} from '../types';

const BASE_URL = 'https://api.sendgrid.com/v3/';

const request = async ({url, method, body}) => {
  const {SENDGRID_API_KEY} = process.env;

  if (!SENDGRID_API_KEY) throw new Error('Please provide SENDGRID_API_KEY');

  const link = `${BASE_URL}${url}`;
  const response = await fetch(link, {
    method,
    headers: {
      'authorization': `Bearer ${SENDGRID_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
};

export const send = async ({
  to,
  subject,
  text = '',
  html = '',
  from = '',
  fromName = '',
}: mail.send) => {
  const {EMAIL_FROM, EMAIL_NAME} = process.env;
  if (!EMAIL_FROM || EMAIL_NAME) {
    throw new Error('Please provide EMAIL_FROM and EMAIL_NAME');
  }

  try {
    const body = {
      personalizations: [{to: generateReciepient(to)}],
      from: {email: from || EMAIL_FROM, name: fromName || EMAIL_NAME},
      subject,
      content: [
        {type: 'text/html', value: html},
        {type: 'text/plain', value: text},
      ],
    };
    return request({url: 'mail/send', body, method: 'post'});
  } catch (error) {
    return false;
  }
};

export const upsertContact = async (fields: mail.UpsertContact) => {
  try {
    return request({
      body: fields,
      method: 'put',
      url: 'marketing/contacts',
    });
  } catch (error) {
    return false;
  }
};
