import nodemailer from 'nodemailer';
import {generateReciepient2} from '.';
import {mail} from '../types';

const {EMAIL_FROM, EMAIL_NAME} = process.env;

export const send = async ({
  to,
  subject,
  text = '',
  html = '',
  from = EMAIL_FROM,
  fromName = EMAIL_NAME,
}: mail.send) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    from = `${fromName} <${from}>`;

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
