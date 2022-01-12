import fetch from "node-fetch";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SENDER_ID } = process.env;

export const send = async ({
  to: To,
  body: Body,
  from: From = TWILIO_SENDER_ID,
}) => {
  try {
    const details = { From, Body, To };
    let body: string | Array<string> = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      body.push(encodedKey + "=" + encodedValue);
    }
    body = body.join("&");

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "post",
        body,
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          authorization: `Basic ${Buffer.from(
            `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
          ).toString("base64")}`,
        },
      }
    );

    const data: any = await response.json();

    return data.sid != null;
  } catch (error) {
    return false;
  }
};
