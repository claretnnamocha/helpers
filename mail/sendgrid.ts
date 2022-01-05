import SendGridMail from "@sendgrid/mail";

const { SENDGRID_API_KEY, EMAIL_FROM, EMAIL_NAME } = process.env;

export const send = async (
  to: string,
  subject: string,
  text: string,
  html: string = null,
  from: string = EMAIL_FROM,
  fromName: string = EMAIL_NAME
) => {
  try {
    SendGridMail.setApiKey(SENDGRID_API_KEY);

    from = `${fromName} <${from}>`;

    const msg = { to, subject, text, html, from };

    await SendGridMail.send(msg);

    return true;
  } catch (error) {
    return false;
  }
};
