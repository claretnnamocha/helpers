import Twilio from "twilio";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SENDER_ID } = process.env;

export const send = async (
  to: string,
  body: string,
  from: string = TWILIO_SENDER_ID
) => {
  try {
    const twilio = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const message = await twilio.messages.create({
      to,
      from,
      body,
    });

    return message.sid != null;
  } catch (error) {
    return false;
  }
};
