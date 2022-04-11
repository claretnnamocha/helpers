import JWT, {JwtPayload} from 'jsonwebtoken';
import {jwt} from './types';

const getEnv = () => {
  const {JWT_SECRET} = process.env;
  return {JWT_SECRET};
};

export const generate = ({payload, expiresIn = null}: jwt.generate) => {
  const {JWT_SECRET} = getEnv();
  return JWT.sign({...payload, timestamp: Date.now()}, JWT_SECRET, {
    expiresIn,
  });
};

export const verify = async (token: string) => {
  const {JWT_SECRET} = getEnv();
  try {
    token = token.replace('Bearer ', '');
    const data: JwtPayload | any = JWT.verify(token, JWT_SECRET);

    if (!Object.keys(data).length) return false;

    return data;
  } catch (error) {
    return false;
  }
};
