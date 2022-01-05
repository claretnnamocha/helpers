import JWT from "jsonwebtoken";
import { env } from "../configs";

export const generate = (payload: any) => {
  return JWT.sign({ ...payload, timestamp: Date.now() }, env.jwtSecret);
};

export const verify = async (token: string) => {
  try {
    token = token.replace("Bearer ", "");
    const data: any = JWT.verify(token, env.jwtSecret);

    let {
      data: { payload, loginValidFrom },
    } = data;
    if (!payload) return false;

    return { payload, loginValidFrom };
  } catch (error) {
    return false;
  }
};
