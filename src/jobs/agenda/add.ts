import {Job, JobAttributesData} from 'agenda';
import {jobs} from '../../types';

export const add = async ({
  queue,
  queueName = '_default_',
  data = {},
}: jobs.agenda.add): Promise<Job<JobAttributesData>> =>
  queue.create(queueName, data).save();
