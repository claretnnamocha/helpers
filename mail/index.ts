export * as mailgun from "./mailgun";
export * as nodemailer from "./nodemailer";
export * as pepipost from "./pepipost";
export * as sendgrid from "./sendgrid";
export * as sendinblue from "./sendinblue";
export * as ses from "./ses";

export const generateReciepient = (to: string | Array<string>) => {
  let reciepients: any;

  if (typeof to === "string") {
    reciepients = [{ email: to }];
  } else {
    reciepients = to.map((email) => ({ email }));
  }
  return reciepients;
};
export const generateReciepient2 = (to: string | Array<string>) => {
  if (typeof to === "string") return to;

  return to.join(",");
};

export const generateReciepient3 = (to: string | Array<string>) => {
  let reciepients: any;

  if (typeof to === "string") {
    reciepients = [to];
    return reciepients;
  }
  return to;
};
