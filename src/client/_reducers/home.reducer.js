import { homeConstants } from '../_constants';

export const home = (state = { type: 'home', message: {} }, action) => {
  // eslint-disable-next-line prefer-destructuring
  const message = JSON.parse(JSON.stringify(state)).message;
  switch (action.type) {
    case homeConstants.ACTIVE: {
      const { key, val } = action.message;
      message[key] = val;
      return {
        type: 'home',
        message,
      };
    }
    case homeConstants.INACTIVE: {
      const { key, val } = action.message;
      message[key] = val;
      return {
        type: 'home',
        message,
      };
    }
    default:
      return state;
  }
};
