import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import './App.css';
// import { Link } from 'react-router-dom';
// import { Router } from 'react-router-dom';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ToastProvider } from 'react-toast-notifications';
import ConnectedHeaderPage from './Header';
import Home from './Home/Home';
// import LogManagement from './LogManagement/LogManagement';
// import ServiceManagement from './ServiceManagement/ServiceManagement';
// import Setting from './SettingManagement/Setting';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from './PrivateRoute';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
// import connectedDrawers from './SettingManagement/Drawers';
import ConnectedServices from './Home/Services';
import Dashboard from './Dashboard/Dashboard';



class App extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    //console.log(toastManager);
    history.listen(() => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
    
  }

  componentDidMount(){
    console.log('helloworld');
  }
  render() {
    const { alert } = this.props;
    const showHeader = () => {
      if (
        history.location.pathname === '/login' ||
        history.location.pathname === '/register'
      ) {
        // console.log('no headerrrrrrrrrrrr');
        return <div />;
      }

      // console.log('headerrrrr');
      return <ConnectedHeaderPage />;
    };
    return (
      <ToastProvider>
        <div>
          <div>
            <div>
              {alert.message && (
                <div className={`alert ${alert.type}`}>{alert.message}</div>
              )}
              <Router history={history}>
                <div>
                  {showHeader(history)}
                  <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute
                      exact
                      path="/services"
                      component={ConnectedServices}
                    />
                    <Route exact path="/Dashboard" component={Dashboard} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                  </Switch>
                </div>
              </Router>
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
  
};

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert,
  };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
