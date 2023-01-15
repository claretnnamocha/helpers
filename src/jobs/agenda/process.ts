import {jobs} from '../../types';

export const process = ({
  queueName = '_default_',
  queue,
  options = {},
  callback,
}: jobs.agenda.process): void => queue.define(queueName, options, callback);
