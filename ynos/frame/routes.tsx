import * as React from "react";
import { Route } from 'react-router-dom'
import App from './containers/InitApp';
import Registration from './components/SignIn/Registration';


export const routes = (
    <div>
        <Route path = "/" exact component={App} />
        <Route path = "/wallet/create" component={Registration} />
    </div>
);