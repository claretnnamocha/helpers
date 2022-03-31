export * as africastalking from "./africastalking";
export * as twilio from "./twilio";

export const generateReciepient = (to: string | Array<string>) => {
  if (typeof to === "string") return to;

  return to.join(",");
};
