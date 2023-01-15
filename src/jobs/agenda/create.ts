import Agenda from 'agenda';
import {jobs} from '../../types';

export const create = ({
  queueName,
  options = {},
}: jobs.agenda.create): Agenda => {
  const {AGENDA_DB_URL} = process.env;

  return new Agenda({
    db: {address: AGENDA_DB_URL},
    name: queueName,
    ...options,
  });
};
