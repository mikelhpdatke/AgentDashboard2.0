/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CardHeader } from '@material-ui/core';
import { homeActions, servicesActions, dialogsActions } from '../../_actions';
import ConnectedAlertDialogSlide from './Dialogs';
import { verifiedIcon, warningIcon } from '../icon/Icon';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  card: {
    minWidth: 275,
    border: '3px solid rgb(131, 167, 233)',
    borderRadius: '20px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  fab: {
    margin: theme.spacing.unit,
  },
});
class SimpleCard extends Component {
  render() {
    // console.log(this.props.status);
    const { classes, status, send, openDialogs, ip } = this.props;
    // let status = "ACTIVE";
    // console.log(this.props.card);
    // console.log(this.props.message[this.props.card]+'??????wtf');
    // if (this.props.message[this.props.card] == false) status = "INACTIVE";
    // const textModal = "Connect";
    // console.log(this.props.status, this.props.status == 'INACTIVE');
    let button;
    let statusButton;
    if (status === 'INACTIVE') {
      button = (
        <Button
          size="small"
          onClick={() => {
            console.log('openedddddddddd');
            openDialogs(true, ip);
          }}
        >
          Connect
        </Button>
      );
      statusButton = (
        <img
          src={warningIcon}
          width="25"
          height="25"
          alt=""
          style={{ margin: '5px 10px' }}
        />
      );
    } else {
      button = (
        <Button
          size="small"
          onClick={() => {
            send({ name: this.props.name, id: this.props.card });
          }}
        >
          <Link to="/services">Analyse</Link>
        </Button>
      );
      statusButton = (
        <img
          src={verifiedIcon}
          width="25"
          height="25"
          alt=""
          style={{ margin: '5px 10px' }}
        />
      );
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          action={statusButton}
          title={`Client: ${this.props.name}`}
          subheader={`${this.props.name}`}
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            {`IP: ${this.props.ip}`}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {`PORT: ${this.props.port}`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color={status === 'ACTIVE' ? 'primary' : 'secondary'}
          >
            {status}
          </Button>
          {button}
          <ConnectedAlertDialogSlide />
        </CardActions>
      </Card>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  openDialogs: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  active: newStatus => {
    dispatch(homeActions.active(newStatus));
  },
  inactive: newStatus => {
    dispatch(homeActions.inactive(newStatus));
  },
  send: newStatus => {
    dispatch(servicesActions.send(newStatus));
  },
  openDialogs: (newStatus, ip) => {
    dispatch(dialogsActions.openDialogs({ status: newStatus, ip }));
  },
});

function mapStateToProps(state) {
  const { message } = state.home;
  return {
    message,
  };
}

const ConnectedCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleCard);

export default withStyles(styles)(ConnectedCard);
