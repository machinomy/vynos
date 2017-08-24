import * as React from "react";
import { Switch, Route } from 'react-router-dom'
import App from './containers/InitApp';
import SignUp from './components/SignIn/Registration';
import SignIn from './components/SignIn/Authentication';
import Welcome from './components/Account/Welcome';

export const routes = (
    <Switch>
        <Route exact path = "/frame.html" component={App} />
        <Route path = "/signup" component={SignUp} />
        <Route path = "/signin" component={SignIn} />
        <Route path = "/welcome" component={Welcome} />
    </Switch>
);