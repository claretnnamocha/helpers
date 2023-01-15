import Agenda from 'agenda';
import {jobs} from '../../types';

export const event = ({
  event: e,
  callback,
  queue,
}: jobs.agenda.event): Agenda => queue.on(e, callback);
