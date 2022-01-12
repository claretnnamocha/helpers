// import Africastalking from "africastalking";

// // curl -X POST \
// // https://api.sandbox.africastalking.com/version1/messaging \
// // -H 'Accept: application/json' \
// // -H 'Content-Type: application/x-www-form-urlencoded' \
// // -H 'apiKey: MyAppApiKey' \
// // -d 'username=MyAppUsername&to=%2B254711XXXYYY,%2B254733YYYZZZ&message=Hello%20World!&from=myShortCode'

// const {
//   AFRICASTALKING_APIKEY,
//   AFRICASTALKING_USERNAME,
//   AFRICASTALKING_SENDER_ID,
// } = process.env;

// export const send = async (
//   to: string,
//   body: string,
//   from: string = AFRICASTALKING_SENDER_ID
// ) => {
//   try {
//     const details = { from, message: body, to };

//     let fb: string | Array<string> = [];
//     for (var property in details) {
//       var encodedKey = encodeURIComponent(property);
//       var encodedValue = encodeURIComponent(details[property]);
//       fb.push(encodedKey + "=" + encodedValue);
//     }
//     fb = fb.join("&");

//     const response = await fetch(
//       `https://api.sandbox.africastalking.com/version1/messaging`,
//       {
//         method: "post",
//         body,
//         headers: {
//           "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
//           authorization: `Basic ${Buffer.from(
//             `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
//           ).toString("base64")}`,
//         },
//       }
//     );

//     return message != null;
//   } catch (error) {
//     return false;
//   }
// };
