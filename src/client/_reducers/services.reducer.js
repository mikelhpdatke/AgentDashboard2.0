import { servicesConstants } from '../_constants';

export function services(state = { name: 'Client', id: 0 }, action) {
  switch (action.type) {
    case servicesConstants.SERVICES:
      return { message: action.message };
    default:
      return state;
  }
}
