import slack from 'slack-notify';
import {slack as types} from './types';

export const notify = (params: types.notify) => {
  const {SLACK_WEBHOOK_URL} = process.env;

  const Slack = slack(SLACK_WEBHOOK_URL);
  let notify: any;

  switch (params.type) {
    case 'success':
      notify = Slack.success;
      break;
    case 'bug':
      notify = Slack.bug;
      break;
    case 'note':
      notify = Slack.note;
      break;
    default:
      notify = Slack.alert;
      break;
  }

  return notify(params.body);
};
