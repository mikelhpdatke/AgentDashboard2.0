import { drawerConstants } from '../_constants';

export const drawer = (
  state = { type: 'drawerClosed', message: false },
  action
) => {
  switch (action.type) {
    case drawerConstants.CLOSED:
      return {
        type: 'drawerClosed',
        message: action.message,
      };
    case drawerConstants.OPENED:
      return {
        type: 'drawerOpened',
        message: action.message,
      };
    default:
      return state;
  }
};
