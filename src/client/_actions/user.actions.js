import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

function login(username, password) {
  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
  return dispatch => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      user => {
        dispatch(success(user));
        history.push('/');
      },
      error => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(user) {
  function request() {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success() {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
  return dispatch => {
    dispatch(request(user));

    userService.register(user).then(
      () => {
        dispatch(success());
        history.push('/login');
        dispatch(alertActions.success('Registration successful'));
      },
      error => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
}

function getAll() {
  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(users) {
    return { type: userConstants.GETALL_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error };
  }
  return dispatch => {
    dispatch(request());
    userService
      .getAll()
      .then(
        users => dispatch(success(users)),
        error => dispatch(failure(error.toString()))
      );
  };
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  // eslint-disable-next-line no-shadow
  function request(id) {
    return { type: userConstants.DELETE_REQUEST, id };
  }
  // eslint-disable-next-line no-shadow
  function success(id) {
    return { type: userConstants.DELETE_SUCCESS, id };
  }
  // eslint-disable-next-line no-shadow
  function failure(id, error) {
    return { type: userConstants.DELETE_FAILURE, id, error };
  }
  return dispatch => {
    dispatch(request(id));

    userService
      .delete(id)
      .then(
        () => dispatch(success(id)),
        error => dispatch(failure(id, error.toString()))
      );
  };
}

export const userActions = {
  login,
  logout,
  register,
  getAll,
  delete: _delete,
};
