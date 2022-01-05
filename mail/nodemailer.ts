const { EMAIL_FROM, EMAIL_NAME } = process.env;

export const send = async (
  to: string,
  subject: string,
  text: string,
  html: string = null,
  from: string = EMAIL_FROM,
  fromName: string = EMAIL_NAME
) => {
  try {
    throw new Error("Yet to be Implemented");
    return true;
  } catch (error) {
    return false;
  }
};
