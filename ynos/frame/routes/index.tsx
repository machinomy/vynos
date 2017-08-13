import * as React from "react";
import { Route } from 'react-router-dom'

import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import Wallet from '../components/Wallet'


export const routes = (
    <div>
        <Route path = "/" component={SignUp} />
    </div>
);
