import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import InitApp from '../containers/InitApp';
import Account from '../containers/Account';
import Channels from '../components/Account/Channels';
import Preferences from '../components/Account/Preferences';
import Network from '../components/Account/Network';
import Restoring from '../components/SignIn/Registration/Restoration';
import TextTerms from '../components/SignIn/Registration/Terms/TextTerms';

import 'semantic-ui-css/semantic.min.css';



export default (
    <Router>
        <Switch>
            <Route exact path="/frame.html" component={InitApp}/>
            <Route path="/terms" component={TextTerms}/>
            <Route path="/restore" component={Restoring}/>
            <Route path="/channels" render={() => <Account><Channels /></Account>}/>
            <Route path="/preferences" render={() => <Account><Preferences /></Account>}/>
            <Route path="/network" render={() => <Account><Network /></Account>}/>
        </Switch>
    </Router>
);