import Bull from 'bull';
import {jobs} from '../../types';

export const add = async ({
  queue,
  queueName = '_default_',
  data,
  options = {},
}: jobs.bulljs.add): Promise<Bull.Job> => queue.add(queueName, data, options);
