import * as React from "react";
import { Switch, Route } from 'react-router-dom'
import App from './containers/InitApp';
import Registration from './components/SignIn/Registration';


export const routes = (
    <Switch>
        <Route exact path = "/frame.html" component={App} />
        <Route path = "/signup" component={Registration} />
    </Switch>
);