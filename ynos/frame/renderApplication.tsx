import 'babel-polyfill'
import * as React from "react";
import * as DOM from "react-dom";
import WorkerProxy from "./WorkerProxy";
import RemoteStore from "./lib/RemoteStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { routes } from './routes';
import {INITIAL_FRAME_STATE} from "./reducers/state";
import reducers from "./reducers/reducers";
import {createLogger} from "redux-logger";
import * as redux from "redux";
import {setWorkerProxy} from "./actions/temp";

require('./css/style.styl');

const MOUNT_POINT_ID  = "mount-point";

function renderToMountPoint(mountPoint: HTMLElement, workerProxy: WorkerProxy) {
    DOM.render(
        <Router>
            {routes}
        </Router>,
        mountPoint
    )
  // workerProxy.getSharedState().then(frameState => {
  //   // let middleware = redux.applyMiddleware(createLogger())
  //   // let store = redux.createStore(reducers, INITIAL_FRAME_STATE, middleware)
  //   // let remoteStore = new RemoteStore(workerProxy, frameState)
  //   // remoteStore.wireToLocal(store)
  //   // store.dispatch(setWorkerProxy(workerProxy))
  //
  //   // function reload() {
  //   //     /*
  //   //     let FrameApplication = require("./FrameApplication").default
  //   //     let application = React.createElement(FrameApplication, { workerProxy, frameState })
  //   //     let provider = React.createElement(Provider, { store: store }, application);
  //   //     console.log(provider); */
  //   //
  //   //     // DOM.render(
  //   //     //     <Provider>
  //   //     //         <Router>
  //   //     //             {routes}
  //   //     //         </Router>
  //   //     //     </Provider>,
  //   //     //     mountPoint
  //   //     // )
  //   // }
  //   //
  //   // reload()
  //
  //   /*
  //   let hotReload = (module as HotModule).hot
  //   if (hotReload) {
  //     hotReload.accept("./ynos/frame/FrameApplication.tsx", () => {
  //       reload()
  //     })
  //   }*/
  //
  // })
}

export default function renderApplication (document: HTMLDocument, workerProxy: WorkerProxy) {
  let mountPoint = document.getElementById(MOUNT_POINT_ID)
  if (mountPoint) {
    renderToMountPoint(mountPoint, workerProxy)
  } else {
    console.error(`Can not find mount point element #${MOUNT_POINT_ID}`)
  }
}
