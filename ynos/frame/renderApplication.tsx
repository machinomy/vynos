import * as React from "react";
import * as DOM from "react-dom";
import WorkerProxy from "./WorkerProxy";
import {Provider} from "react-redux";
import configureStore from './store/configureStore'
import routes from './routes'

const MOUNT_POINT_ID = "mount-point";


async function renderToMountPoint(mountPoint: HTMLElement, workerProxy: WorkerProxy) {
    const frameState = await workerProxy.getSharedState();
    const store = configureStore(workerProxy, frameState);

    DOM.render(
        <Provider store={store}>
            {routes}
        </Provider>,
        mountPoint)
}

export default function renderApplication (document: HTMLDocument, workerProxy: WorkerProxy) {
  let mountPoint = document.getElementById(MOUNT_POINT_ID)
  if (mountPoint) {
    renderToMountPoint(mountPoint, workerProxy)
  } else {
    console.error(`Can not find mount point element #${MOUNT_POINT_ID}`)
  }
}
