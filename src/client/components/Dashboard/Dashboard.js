import React from 'react';
import { ip } from '../Utils';

class Dashboard extends React.Component {
  render() {
    
    return (
      <div>
        <iframe
          title="Dashboard"
          src="http://localhost:5601/app/kibana#/dashboard/5bf88730-0397-11e9-a54d-e1af34a01ef0?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3A'2018-12-19T13%3A45%3A48.818Z'%2Cmode%3Aabsolute%2Cto%3A'2018-12-20T16%3A59%3A59.999Z'))" 
          style={{
            position: 'fixed',
            top: '80px',
            left: '0px',
            bottom: '0px',
            right: '0px',
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            marginTop: 0,
            padding: 0,
            overflow: 'hidden',
            zIndex: 999999,
          }}
        />
      </div>
      
    );
  }
}

export default Dashboard;
