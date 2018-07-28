import * as React from 'react'
import * as DOM from 'react-dom'
import WorkerProxy from './WorkerProxy'
import { Provider, Store } from 'react-redux'
import { routerMiddleware } from 'react-router-redux'
import { createLogger } from 'redux-logger'
import * as redux from 'redux'
import { FrameState, initialState } from './redux/FrameState'
import RemoteStore from './lib/RemoteStore'
import createHashHistory from 'history/createHashHistory'
import reducers from './redux/reducers'
import { AppContainer } from 'react-hot-loader'

const MOUNT_POINT_ID = 'mount-point'

async function renderToMountPoint (mountPoint: HTMLElement, workerProxy: WorkerProxy): Promise<void> {
  const history = createHashHistory()
  const middleware = redux.applyMiddleware(createLogger(), routerMiddleware(history))
  let store: Store<FrameState> = redux.createStore(reducers(workerProxy), initialState(workerProxy), middleware)

  if (module.hot) {
    module.hot.accept('./redux/reducers', () => {
      const nextRootReducer = require('./redux/reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  const frameState = await workerProxy.getSharedState()
  let remoteStore = new RemoteStore(workerProxy, frameState)
  remoteStore.wireToLocal(store)

  function reload () {
    let RootContainer = require('./pages/RootContainer').default
    let application = React.createElement(RootContainer, {})
    let container = React.createElement(AppContainer, undefined, application)
    let provider = React.createElement(Provider, { store: store }, container)
    DOM.render(provider, mountPoint)
  }

  reload()

  let hotReload = module.hot
  if (hotReload) {
    hotReload.accept('./vynos/frame/pages/RootContainer.tsx', () => {
      reload()
    })
  }
}

export default async function renderApplication (document: HTMLDocument, workerProxy: WorkerProxy): Promise<void> {
  let mountPoint = document.getElementById(MOUNT_POINT_ID)
  if (mountPoint) {
    return renderToMountPoint(mountPoint, workerProxy)
  } else {
    console.error(`Can not find mount point element #${MOUNT_POINT_ID}`)
  }
}
