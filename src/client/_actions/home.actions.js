import { homeConstants } from '../_constants';

function active(message) {
  return { type: homeConstants.ACTIVE, message };
}

function inactive(message) {
  return { type: homeConstants.INACTIVE, message };
}

export const homeActions = {
  active,
  inactive,
};
