import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { drawer } from './drawer.reducer';
import { home } from './home.reducer';
import { services } from './services.reducer';
import { dialogs } from './dialogs.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  drawer,
  home,
  services,
  dialogs,
});

export default rootReducer;
