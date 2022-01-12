import fetch from "node-fetch";
import { generateReciepient } from ".";
import { mail } from "../types";

const { SENDGRID_API_KEY, EMAIL_FROM, EMAIL_NAME } = process.env;

export const send = async ({
  to,
  subject,
  text = "",
  html = "",
  from = EMAIL_FROM,
  fromName = EMAIL_NAME,
}: mail.send) => {
  try {
    const body = {
      personalizations: [{ to: generateReciepient(to) }],
      from: { email: from, name: fromName },
      subject,
      content: [
        { type: "text/html", value: html },
        { type: "text/plain", value: text },
      ],
    };

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "post",
      headers: {
        authorization: `Bearer ${SENDGRID_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.status === 202;
  } catch (error) {
    return false;
  }
};
