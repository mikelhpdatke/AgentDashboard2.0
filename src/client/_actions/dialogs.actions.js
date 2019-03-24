import { dialogsConstants } from '../_constants';

function openDialogs(message) {
  return { type: dialogsConstants.DIALOGS, message };
}

function closeDialogs(message) {
  return { type: dialogsConstants.DIALOGS, message };
}

export const dialogsActions = {
  openDialogs,
  closeDialogs,
};
