import JWT, { JwtPayload } from "jsonwebtoken";
import { jwt } from "./types";

const { JWT_SECRET } = process.env;

export const generate = (payload: jwt.generate) => {
  return JWT.sign({ ...payload, timestamp: Date.now() }, JWT_SECRET);
};

export const verify = async (token: string) => {
  try {
    token = token.replace("Bearer ", "");
    const data: JwtPayload = JWT.verify(token, JWT_SECRET);

    if (!Object.keys(data).length) return false;

    return data;
  } catch (error) {
    return false;
  }
};
