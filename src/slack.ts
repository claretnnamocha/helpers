import Slack from "slack-notify";
import { slack as types } from "./types";
const { SLACK_WEBHOOK_URL } = process.env;

export const notify = (params: types.notify) => {
  const slack = Slack(SLACK_WEBHOOK_URL);
  let notify: any;

  switch (params.type) {
    case "success":
      notify = slack.success;
      break;
    case "bug":
      notify = slack.bug;
      break;
    case "note":
      notify = slack.note;
      break;
    default:
      notify = slack.alert;
      break;
  }

  return notify(params.body);
};
