import { drawerConstants } from '../_constants';

function opened(message) {
  return { type: drawerConstants.OPENED, message };
}

function closed(message) {
  return { type: drawerConstants.CLOSED, message };
}

export const drawerActions = {
  opened,
  closed,
};
