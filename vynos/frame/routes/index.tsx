import * as React from "react";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

/** containers */
import DashboardMenu from '../containers/DashboardMenu'
import RootRoute from './RootRoute'

/** components */
import Channels from '../components/Account/Channels'
import Preferences from '../components/Account/Preferences'
import Network from '../components/Account/Network'
import Restoring from '../components/SignIn/Registration/Restoration'
import TextTerms from '../components/SignIn/Registration/Terms/TextTerms'
import MyWallet from '../components/Account/MyWallet'
import SignUp from '../components/SignIn/Registration';


export default (
  <Router>
    <Switch>
      <Route exact path="/" component={RootRoute} />
      <Route path="/sign_up" component={SignUp} />

      <Route path="/terms" component={TextTerms} />
      <Route path="/restore" component={Restoring} />

      <Switch>
        <DashboardMenu>
          <Route exact path="/dashboard" component={MyWallet}/>
          <Route path="/dashboard/channels" component={Channels}/>
          <Route path="/dashboard/preferences" component={Preferences}/>
          <Route path="/dashboard/network" component={Network} />
        </DashboardMenu>
      </Switch>
    </Switch>
  </Router>
);
