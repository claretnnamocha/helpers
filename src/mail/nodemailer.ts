import nodemailer from 'nodemailer';
import {generateReciepient2} from '.';
import {mail} from '../types';

export const send = async ({
  to,
  subject,
  text = '',
  html = '',
  from = '',
  fromName = '',
}: mail.send) => {
  const {EMAIL_FROM, EMAIL_NAME, EMAIL_PORT, EMAIL_HOST} = process.env;

  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT),
      secure: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    from = `${fromName || EMAIL_NAME} <${from || EMAIL_FROM}>`;

    const info = await transporter.sendMail({
      from,
      to: generateReciepient2(to),
      subject,
      text,
      html,
    });

    return info.messageId !== undefined;
  } catch (error) {
    return false;
  }
};
