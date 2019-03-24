import { dialogsConstants } from '../_constants';

export function dialogs(
  state = {
    type: dialogsConstants.DIALOGS,
    message: { status: false, ip: '0.0.0.0' },
  },
  action
) {
  switch (action.type) {
    case dialogsConstants.DIALOGS:
      return {
        type: dialogsConstants.DIALOGS,
        message: action.message,
      };
    default:
      return state;
  }
}
