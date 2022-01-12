import fetch from "node-fetch";
import { generateReciepient2 } from ".";
import { mail } from "../types";

const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_USERNAME,
  EMAIL_FROM,
  EMAIL_NAME,
} = process.env;

export const send = async ({
  to,
  subject,
  text = "",
  html = "",
  from = EMAIL_FROM,
  fromName = EMAIL_NAME,
}: mail.send) => {
  try {
    from = `${fromName} <${from}>`;

    const fd = new FormData();

    fd.append("from", from);
    fd.append("to", generateReciepient2(to));
    fd.append("subject", subject);
    fd.append("text", text);
    fd.append("html", html);

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/message`,
      {
        method: "post",
        headers: {
          authorization: `Basic ${Buffer.from(
            `api:${MAILGUN_API_KEY}`
          ).toString("base64")}`,
        },
        body: fd,
      }
    );

    return response.status === 200;
  } catch (error) {
    return false;
  }
};
