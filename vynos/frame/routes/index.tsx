import * as React from 'react'
import {Switch, Route} from 'react-router-dom'
import {History} from 'history'
import {ConnectedRouter} from 'react-router-redux'

import Channels from '../components/Account/Channels'
import Preferences from '../components/Account/Preferences'
import Network from '../components/Account/Network'
import Wallet from '../components/WalletPage'

import Terms from '../components/TermsPage'
import InitPage from '../components/InitPage'
import Restore from '../components/RestorePage'
import WalletMenu from '../containers/WalletMenu'
import ApprovePage from "../components/WalletPage/ApprovePage";

export interface RoutesProps {
  history: History
}

const routes: React.SFC<RoutesProps> = (props: RoutesProps) => {
  return <ConnectedRouter history={props.history}>
    <Switch>
      <Route path="/init" component={InitPage}/>
      <Route path="/terms" component={Terms}/>
      <Route path="/restore" component={Restore}/>

      <Route path="/approve" component={ApprovePage} />

      <Switch>
        <WalletMenu>
          <Route exact path="/wallet" component={Wallet}/>
          <Route path="/wallet/channels" component={Channels}/>
          <Route path="/wallet/preferences" component={Preferences}/>
          <Route path="/wallet/network" component={Network} />
        </WalletMenu>
      </Switch>

    </Switch>
  </ConnectedRouter>
}

export default routes
