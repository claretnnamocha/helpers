import {request} from './request';

export const notify = async ({error}) => {
  const {
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
    NODE_ENV,
    ALLOW_TELEGRAM_NOTIFICATIONS,
  } = process.env;

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID && ALLOW_TELEGRAM_NOTIFICATIONS) {
    const text =
      `Environment: ${NODE_ENV}%0A%0A` +
      `Name: ${error.name}%0A%0A` +
      `Message: ${error.message}%0A%0A` +
      `Stack: ${error.stack}`;

    const url =
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?` +
      `chat_id=${TELEGRAM_CHAT_ID}` +
      `&text=${text}`;

    await request(url, {method: 'get'});
  }
};
