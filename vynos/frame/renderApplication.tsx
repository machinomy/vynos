import * as React from 'react'
import * as DOM from 'react-dom'
import WorkerProxy from './WorkerProxy'
import {Provider, Store} from 'react-redux'
import Routes from './routes'

import 'semantic-ui-css/semantic.min.css';
import {routerMiddleware} from "react-router-redux";
import {createLogger} from "redux-logger";
import * as redux from "redux";
import {FrameState, INITIAL_FRAME_STATE} from "./state/FrameState";
import RemoteStore from "./lib/RemoteStore";
import {setWorkerProxy} from "./actions/temp";
import createHashHistory from 'history/createHashHistory';
import reducers from './state/reducers'

const MOUNT_POINT_ID = 'mount-point'

async function renderToMountPoint(mountPoint: HTMLElement, workerProxy: WorkerProxy) {
  const frameState = await workerProxy.getSharedState();
  const history = createHashHistory()
  const middleware = redux.applyMiddleware(createLogger(), routerMiddleware(history))
  let store: Store<FrameState> = redux.createStore(reducers, INITIAL_FRAME_STATE, middleware)
  let remoteStore = new RemoteStore(workerProxy, frameState)
  remoteStore.wireToLocal(store)
  store.dispatch(setWorkerProxy(workerProxy))

  const application =
    <Provider store={store}>
      <Routes history={history} />
    </Provider>

  DOM.render(application, mountPoint)
}

export default function renderApplication (document: HTMLDocument, workerProxy: WorkerProxy) {
  let mountPoint = document.getElementById(MOUNT_POINT_ID)
  if (mountPoint) {
    renderToMountPoint(mountPoint, workerProxy)
  } else {
    console.error(`Can not find mount point element #${MOUNT_POINT_ID}`)
  }
}
