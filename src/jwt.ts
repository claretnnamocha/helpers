import JWT, {JwtPayload} from 'jsonwebtoken';
import {jwt} from './types';

const getEnv = () => {
  const {JWT_SECRET} = process.env;
  return {JWT_SECRET};
};

export const generate = ({
  payload,
  secret = null,
  expiresIn = null,
}: jwt.generate) => {
  const {JWT_SECRET} = getEnv();
  const opts = expiresIn ? {expiresIn} : {};
  return JWT.sign(
      {...payload, timestamp: Date.now()},
      secret || JWT_SECRET,
      opts,
  );
};

export const verify = async ({token, secret = null}: jwt.verify) => {
  const {JWT_SECRET} = getEnv();
  try {
    token = token.replace('Bearer ', '');
    const data: JwtPayload | any = JWT.verify(token, secret || JWT_SECRET);

    if (!Object.keys(data).length) return false;

    return data;
  } catch (error) {
    return false;
  }
};
