/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withToastManager } from 'react-toast-notifications';
import { dialogsActions } from '../../_actions';
import { PostApi } from '../Utils';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.Component {
  toastId = null;

  customToastId = 'xxx-yyy';

  render() {
    const { dialogs, closeDialogs, toastManager } = this.props;
    console.log(`${dialogs.message}ffffffffffffffff`);
    return (
      <div>
        <Dialog
          open={dialogs.message.status}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            closeDialogs(false, dialogs.message.ip);
          }}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">WARNING</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure to install agent to this device?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                closeDialogs(false, dialogs.message.ip);
              }}
              color="primary"
            >
              Disagree
            </Button>
            <Button
              onClick={() => {
                closeDialogs(false, dialogs.message.ip);
                PostApi('/api/installAgent', { ip: dialogs.message.ip })
                  .then(res => {
                    // console.log('in postapi resssss');
                    // console.log(`${res.status}in postapi resssss`);
                    if (res.status === 'err') {
                      console.log('wtf ress???');
                      return Promise.reject(new Error('err'));
                    }
                    console.log('show toaskkkkkkkk');
                    toastManager.add('Install agent successfully', {
                      appearance: 'success',
                      autoDismissTimeout: '5000',
                      autoDismiss: 'true',
                    });
                  })
                  .catch(() => {
                    toastManager.add(
                      'Somethings went wrong, please try again!',
                      {
                        appearance: 'error',
                        autoDismissTimeout: '5000',
                        autoDismiss: 'true',
                      }
                    );
                  });
              }}
              color="primary"
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialogSlide.propTypes = {
  dialogs: PropTypes.object.isRequired,
  closeDialogs: PropTypes.func.isRequired,
  toastManager: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { dialogs } = state;
  return {
    dialogs,
  };
}

const mapDispatchToProps = dispatch => ({
  openDialogs: newStatus => {
    dispatch(dialogsActions.openDialogs(newStatus));
  },
  closeDialogs: (newStatus, ip) => {
    dispatch(dialogsActions.closeDialogs({ status: newStatus, ip }));
  },
});

const ConnectedAlertDialogSlide = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertDialogSlide);
export default withToastManager(ConnectedAlertDialogSlide);
