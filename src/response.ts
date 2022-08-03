import {Response} from 'express';
import * as telegram from './telegram';

export const response = async (
    res: Response,
    data: any,
    code: number = 200,
    debug = false,
) => {
  const error: Error = data.error;

  if (!debug) delete data.error;

  res.status(code).send({
    ...data,
    timestamp: `${new Date().toUTCString()}`,
  });

  if (error) telegram.notify({error});
};
