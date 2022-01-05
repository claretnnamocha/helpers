import SibApiV3Sdk from "sib-api-v3-sdk";

const { SENDINBLUE_API_KEY, EMAIL_FROM, EMAIL_NAME } = process.env;

export const send = async (
  to: string,
  subject: string,
  text: string,
  html: string = null,
  from: string = EMAIL_FROM,
  fromName: string = EMAIL_NAME
) => {
  try {
    let defaultClient = SibApiV3Sdk.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = SENDINBLUE_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = { name: fromName, email: from };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = text;

    sendSmtpEmail.to = [{ email: to }];
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return true;
  } catch (error) {
    return false;
  }
};
