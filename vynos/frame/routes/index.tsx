import * as React from 'react'
import {Switch, Route} from 'react-router-dom'
import {History} from 'history'
import {ConnectedRouter} from 'react-router-redux'

import ApplicationMenu from '../containers/ApplicationMenu'
import RootRoutes from './RootRoutes'
import Channels from '../components/Account/Channels'
import Preferences from '../components/Account/Preferences'
import Network from '../components/Account/Network'
import MyWallet from '../components/Account/MyWallet'

import Terms from '../components/Terms'
import InitPage from '../components/InitPage'
import Restore from '../components/RestorePage'

export interface RoutesProps {
  history: History
}

const routes: React.SFC<RoutesProps> = (props: RoutesProps) => {
  return <ConnectedRouter history={props.history}>
    <Switch>
      <Route path="/init" component={InitPage}/>
      <Route path="/terms" component={Terms}/>
      <Route path="/restore" component={Restore}/>

      <Route exact path="/" component={RootRoutes}/>
      <Switch>
        <ApplicationMenu>
          <Route exact path="/dashboard" component={MyWallet}/>
          <Route path="/dashboard/channels" component={Channels}/>
          <Route path="/dashboard/preferences" component={Preferences}/>
          <Route path="/dashboard/network" component={Network}/>
        </ApplicationMenu>
      </Switch>

      <Route component={RootRoutes} />
    </Switch>
  </ConnectedRouter>
}

export default routes
