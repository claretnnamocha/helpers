import Bull from 'bull';
import {jobs} from '../../types';

export const event = ({
  event: e,
  callback,
  queue,
}: jobs.bulljs.event): Bull.Queue => queue.on(e, callback);
