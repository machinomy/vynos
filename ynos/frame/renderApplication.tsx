import * as React from "react";
import * as DOM from "react-dom";
import {AppContainer} from "react-hot-loader";
import WorkerProxy from "./WorkerProxy";
import RemoteStore from "./lib/RemoteStore";
import {Provider} from "react-redux";
import {INITIAL_FRAME_STATE} from "./state";
import reducers from "./reducers";
import {createLogger} from "redux-logger";
import * as redux from "redux";
import {setWorkerProxy} from "./actions/temp";
import ThemeProvider from "./theme/ThemeProvider";

const MOUNT_POINT_ID = "mount-point"

function renderToMountPoint(mountPoint: HTMLElement, workerProxy: WorkerProxy) {
  workerProxy.getSharedState().then(frameState => {
    let middleware = redux.applyMiddleware(createLogger())
    let store = redux.createStore(reducers, INITIAL_FRAME_STATE, middleware)
    let remoteStore = new RemoteStore(workerProxy, frameState)
    remoteStore.wireToLocal(store)
    store.dispatch(setWorkerProxy(workerProxy))

    function reload() {
      let FrameApplication = require("./FrameApplication").default
      let application = React.createElement(FrameApplication, { workerProxy, frameState })
      let theme = React.createElement(ThemeProvider, undefined, application)
      let container = React.createElement(AppContainer, undefined, theme)
      let provider = React.createElement(Provider, { store: store }, container);
      DOM.render(provider, mountPoint)
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