import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
// import TextareaAutosize from 'react-textarea-autosize';
// eslint-disable-next-line import/no-unresolved
import openSocket from 'socket.io-client';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { homeActions } from '../../_actions/index';
// import { servicesActions } from '../../_actions';
import { PostApi, ip } from '../Utils';

const socket = openSocket(ip.server);
function subscribeToTimer(cb) {
  socket.on('timer', res => cb(null, res));
}

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  h1: {
    textAlign: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.1)',
    padding: '2px',
    color: 'red',
    fontSize: '40px',
    marginTop: '3px',
  },
  contrainer: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'center',
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  card: {
    minWidth: 275,
    border: '3px solid rgb(131, 167, 233)',
    borderRadius: '20px',
    margin: '5px 5px',
    padding: '4px',
  },
});

const options = [
  'Get PID and MD5 data',
  'Get network data',
  'Get syscall data',
];

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      selectedIndex: 1,
      pid: 0,
      dataRecevied: '',
      sendding: false,
      openSnackBar: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickSnackBar = this.handleClickSnackBar.bind(this);
    this.handleCloseSnackBar = this.handleCloseSnackBar.bind(this);

    subscribeToTimer((err, res) => {
      this.setState(state => {
        let newData = state.dataRecevied;
        newData += res;
        if (newData.length > 10) {
          newData = 'hello';
        }
        return { dataRecevied: newData, sendding: false, openSnackBar: true };
      });
    });
  }

  handleClickSnackBar = () => {
    this.setState({ openSnackBar: true });
  };

  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openSnackBar: false });
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null, dataRecevied: '' });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChange(e) {
    const { name } = e.target;
    const { value } = e.target;
    if (name === 'pid') {
      console.log('in HanleChane pid');
      this.setState({ pid: value }, () => {
        console.log(this.state);
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    let sendState;
    const { sendding, pid, selectedIndex, openSnackBar } = this.state;
    const { message } = this.props;
    if (sendding === true) {
      sendState = (
        <div className="col-1">
          <CircularProgress className={classes.progress} />
        </div>
      );
    } else {
      sendState = (
        <div className="col-1">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // console.log(this.state);
              // this.setState({ dataRecevied: "Hello" });
              const data = {
                id: message.id,
                task: selectedIndex + 1,
                pid,
              };
              this.setState({ sendding: true }, () => {
                PostApi('api/fetch', data).then(() => {
                  console.log('Run send_cmd ok!!!');
                  // setInterval(() => {
                  //  this.setState({ sendding: false, openSnackBar:true });
                  // }, 5000);
                });
              });
            }}
          >
            Send
          </Button>
        </div>
      );
    }
    let textField = (
      <div className="col-4">
        <TextField
          id="outlined-uncontrolled"
          label="PID"
          name="pid"
          value={pid}
          className={classes.textField}
          onChange={this.handleChange}
          margin="normal"
          variant="outlined"
        />
      </div>
    );

    if (selectedIndex !== 2) {
      textField = <div />;
    }
    // console.log(this.props.title); this.props.message.card
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSnackBar}
          autoHideDuration={5000}
          onClose={this.handleCloseSnackBar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Successfully received</span>}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.handleCloseSnackBar}
            >
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleCloseSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />

        <h1 className={classes.h1}>{message.name}</h1>
        <div className="container" style={{ marginTop: '200px' }}>
          <div className="row justify-content-center">
            <div className="col-4">
              <div className={classes.root}>
                <List component="nav" className={classes.card}>
                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Function"
                    onClick={this.handleClickListItem}
                  >
                    <ListItemText
                      primary="Function"
                      secondary={options[selectedIndex]}
                    />
                  </ListItem>
                </List>
                <Menu
                  id="lock-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                >
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={event => this.handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </div>

            {textField}
          </div>
          <div className="container">
            <div className="row justify-content-center">{sendState}</div>
          </div>
        </div>
      </div>
    );
  }
}

Services.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  active: newStatus => {
    dispatch(homeActions.active(newStatus));
  },
  inactive: newStatus => {
    dispatch(homeActions.inactive(newStatus));
  },
});

function mapStateToProps(state) {
  const { message } = state.services;
  return {
    message,
  };
}

const ConnectedServices = connect(
  mapStateToProps,
  mapDispatchToProps
)(Services);

export default withStyles(styles)(ConnectedServices);
