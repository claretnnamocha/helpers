import formData from "form-data";
import Mailgun from "mailgun.js";

const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_USERNAME,
  EMAIL_FROM,
  EMAIL_NAME,
} = process.env;

export const send = async (
  to: string,
  subject: string,
  text: string,
  html: string = null,
  from: string = EMAIL_FROM,
  fromName: string = EMAIL_NAME
) => {
  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: MAILGUN_USERNAME,
      key: MAILGUN_API_KEY,
    });

    from = `${fromName} <${from}>`;

    await mg.messages.create(MAILGUN_DOMAIN, {
      from,
      to: [to],
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
    return false;
  }
};
