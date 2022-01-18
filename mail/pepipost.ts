import fetch from "node-fetch";
import { mail } from "../types";

const { NETCORE_API, EMAIL_FROM, EMAIL_NAME } = process.env;

export const send = async ({
  to,
  subject,
  text,
  html = null,
  from = EMAIL_FROM,
  fromName = EMAIL_NAME,
}: mail.send) => {
  try {
    const options = {
      method: "POST",
      headers: { api_key: NETCORE_API, "content-type": "application/json" },
      body: JSON.stringify({
        from: { email: from, name: fromName },
        subject,
        content: [{ type: "html", value: html }],
        personalizations: [{ to: [{ email: to }] }],
      }),
    };

    const response = await fetch(
      "https://api.pepipost.com/v5.1/mail/send",
      options
    );

    console.log(response.status);

    const d = await response.text();

    console.log(d)

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};
