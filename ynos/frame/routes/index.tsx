import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import InitApp from '../containers/InitApp';
import Account from '../containers/Account';
import Channels from '../components/Account/Channels';
import Preferences from '../components/Account/Preferences';
import Network from '../components/Account/Network';
import 'semantic-ui-css/semantic.min.css';
import TextTerms from '../components/SignIn/Registration/Terms/TextTerms';


export default (
    <Router>
        <Switch>
            <Route exact path="/frame.html" component={InitApp}/>
            <Route path="/terms" component={TextTerms}/>
            <Route path="/channels" component={Channels}/>
            <Route path="/preferences" component={Preferences}/>
            <Route path="/network" component={Network}/>
        </Switch>
    </Router>
);