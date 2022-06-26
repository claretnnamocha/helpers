import Bull from 'bull';
import {jobs} from '../types';

export const create = ({
  queueName,
  options = {},
}: jobs.create): Bull.Queue => {
  const {REDIS_URL = null, REDIS_TLS_URL = null} = process.env;
  return new Bull(queueName, REDIS_TLS_URL || REDIS_URL, options);
};
