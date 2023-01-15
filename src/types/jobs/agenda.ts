import Agenda, {AgendaConfig, Processor, DefineOptions} from 'agenda';

export interface create {
  queueName: string;
  options?: AgendaConfig;
}

export interface process {
  queue: Agenda;
  queueName?: string;
  concurrency?: number;
  options?: DefineOptions;
  callback: Processor<any>;
}

export interface add {
  queue: Agenda;
  queueName?: string;
  data: any;
}

export interface event {
  queue: Agenda;
  event?: string | symbol;
  callback: (...args: any[]) => void;
}
