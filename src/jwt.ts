import JWT from "jsonwebtoken";

export const generate = ({ payload, expiresIn, secret }) => {
  return JWT.sign({ payload, timestamp: Date.now() }, secret, {
    expiresIn,
  });
};

export const verify = async ({ token, secret }) => {
  try {
    token = token.replace("Bearer ", "");
    const data: any = JWT.verify(token, secret);

    let {
      data: { payload },
    } = data;

    return payload;
  } catch (error) {
    return false;
  }
};
