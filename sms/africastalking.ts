import { generateReciepient } from ".";
import { sms } from "../types";

const {
  AFRICASTALKING_APIKEY: apiKey,
  AFRICASTALKING_USERNAME: username,
  AFRICASTALKING_SENDER_ID,
} = process.env;

export const send = async ({
  to,
  body: message,
  from = AFRICASTALKING_SENDER_ID,
}: sms.send) => {
  try {
    to = generateReciepient(to);
    const details = { username, from, message, to };

    let body: string | Array<string> = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      body.push(encodedKey + "=" + encodedValue);
    }
    body = body.join("&");

    const response = await fetch(
      `https://api.africastalking.com/version1/messaging`,
      {
        method: "post",
        body,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          accept: "application/json",
          apiKey,
        },
      }
    );

    return [100, 101, 102].includes(response.status);
  } catch (error) {
    return false;
  }
};
