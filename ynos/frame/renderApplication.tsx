import * as React from "react";
import * as DOM from "react-dom";
import {AppContainer} from "react-hot-loader";
import WorkerProxy from "./WorkerProxy";
import RemoteStore from "./lib/RemoteStore";
import {Provider} from "react-redux";
import {INITIAL_FRAME_STATE} from "./reducers/state";
import reducers from "./reducers/reducers";
import {createLogger} from "redux-logger";
import * as redux from "redux";
import {setWorkerProxy} from "./actions/temp";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
//import { routes } from './routes';
import Account from './containers/Account';
import SignUp from './components/SignIn/Registration';
import SignIn from './components/SignIn/Authentication';
import MyWallet from './components/Account/MyWallet';
import Channels from './components/Account/Channels';
import Preferences from './components/Account/Preferences';
import Network from './components/Account/Network';
import 'semantic-ui-css/semantic.min.css';
import "material-components-web/dist/material-components-web.css";

const MOUNT_POINT_ID = "mount-point";

function renderToMountPoint(mountPoint: HTMLElement, workerProxy: WorkerProxy) {
  workerProxy.getSharedState().then(frameState => {
    let middleware = redux.applyMiddleware(createLogger())
    let store = redux.createStore(reducers, INITIAL_FRAME_STATE, middleware)
    let remoteStore = new RemoteStore(workerProxy, frameState)
    remoteStore.wireToLocal(store)
    store.dispatch(setWorkerProxy(workerProxy))

    function reload() {
      //let FrameApplication = require("./FrameApplication").default
      //let application = React.createElement(FrameApplication, { workerProxy, frameState })
      // FIXME let container = React.createElement(AppContainer, undefined, application)
      //let provider = React.createElement(Provider, { store: store }, application);

      if (!store.getState().shared.didInit) {
        DOM.render(
            <Provider store={store}>
              <Router>
                <Switch>
                  <Route exact path = "/frame.html" component={SignUp} />
                </Switch>
              </Router>
            </Provider>
            ,mountPoint)
      }

        if (store.getState().shared.didInit
            && store.getState().temp.workerProxy
            && store.getState().shared.isLocked) {
            DOM.render(
                <Provider store={store}>
                    <Router>
                        <Switch>
                            <Route exact path = "/frame.html" component={SignIn} />
                        </Switch>
                    </Router>
                </Provider>
                ,mountPoint)
        }

      if (store.getState().shared.didInit
                && store.getState().temp.workerProxy
                && !store.getState().shared.isLocked) {
        DOM.render(
            <Provider store={store}>
                <Router>
                  <Account>
                    <Switch>
                      <Route exact path = "/frame.html" component={MyWallet} />
                      <Route path = "/channels" component={Channels} />
                      <Route path = "/preferences" component={Preferences} />
                      <Route path = "/network" component={Network} />
                    </Switch>
                  </Account>
                </Router>
            </Provider>
            ,mountPoint)
      }

    }

    reload()

    let hotReload = (module as HotModule).hot
    if (hotReload) {
      hotReload.accept("./ynos/frame/FrameApplication.tsx", () => {
        reload()
      })
    }
  })
}

export default function renderApplication (document: HTMLDocument, workerProxy: WorkerProxy) {
  let mountPoint = document.getElementById(MOUNT_POINT_ID)
  if (mountPoint) {
    renderToMountPoint(mountPoint, workerProxy)
  } else {
    console.error(`Can not find mount point element #${MOUNT_POINT_ID}`)
  }
}
