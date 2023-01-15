import Bull from 'bull';
import {jobs} from '../../types';

export const create = ({
  queueName,
  options = {},
}: jobs.bulljs.create): Bull.Queue => {
  const {REDIS_URL = null} = process.env;

  return new Bull(queueName, REDIS_URL, options);
};
