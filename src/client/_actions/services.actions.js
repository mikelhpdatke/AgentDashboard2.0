import { servicesConstants } from '../_constants';

function send(message) {
  return { type: servicesConstants.SERVICES, message };
}

export const servicesActions = {
  send,
};
