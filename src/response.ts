import { Response } from "express";

export const response = (res: Response, data: object, code: number = 200) => {
  res.status(code).send({
    ...data,
    timestamp: `${new Date().toUTCString()}`,
  });
};
