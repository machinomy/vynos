import * as React from 'react'
import {Switch, Route} from 'react-router-dom'
import {History} from 'history'
import {ConnectedRouter} from 'react-router-redux'

import Channels from '../components/Account/Channels'
import Preferences from '../components/Account/Preferences'
import Network from '../components/Account/Network'
import Wallet from '../components/WalletPage'

import ApprovePage from "../components/WalletPage/ApprovePage";

export interface RoutesProps {
  history: History
}

const routes: React.SFC<RoutesProps> = (props: RoutesProps) => {
  return <ConnectedRouter history={props.history}>
    <Switch>
      <Route path="/approve" component={ApprovePage} />

      <Switch>
          <Route exact path="/wallet" component={Wallet}/>
          <Route path="/wallet/channels" component={Channels}/>
          <Route path="/wallet/preferences" component={Preferences}/>
          <Route path="/wallet/network" component={Network} />
      </Switch>

    </Switch>
  </ConnectedRouter>
}

export default routes
