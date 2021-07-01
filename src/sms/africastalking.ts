import Africastalking from "africastalking";

const {
  AFRICASTALKING_APIKEY,
  AFRICASTALKING_USERNAME,
  AFRICASTALKING_SENDER_ID,
} = process.env;
let SMS: any, credentials: any;

const init = () => {
  credentials = {
    apiKey: AFRICASTALKING_APIKEY,
    username: AFRICASTALKING_USERNAME,
  };

  SMS = Africastalking(credentials).SMS;
};

export const send = async (
  to: string,
  body: string,
  from: string = AFRICASTALKING_SENDER_ID
) => {
  try {
    init();
    const message = await SMS.send({ to, from, message: body });

    return message != null;
  } catch (error) {
    return false;
  }
};
