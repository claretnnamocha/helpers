import SendGridMail from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;

export const send = async (
  to: string,
  subject: string,
  text: string,
  html: string = null,
  from: string = "Claret Nnamocha <devclareo@gmail.com>"
) => {
  try {
    SendGridMail.setApiKey(SENDGRID_API_KEY);

    const msg = { to, subject, text, html, from };

    await SendGridMail.send(msg);

    return { status: true, message: "Mail sent successfully!" };
  } catch (error) {
    return { status: false, message: "Mail failed to send, try again later!" };
  }
};
