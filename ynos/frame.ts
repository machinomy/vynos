import React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import localForage from "localforage";
import { persistStore, autoRehydrate } from "redux-persist";
import {Provider} from "react-redux";
import * as redux from "redux";
import reducers from "./frame/reducers";
import {INITIAL_STATE} from "./frame/state";
import FrameStream from "./lib/FrameStream";
import injectTapEventPlugin from "react-tap-event-plugin";
import PostStream from "./lib/PostStream";
import dnode, {Dnode} from "dnode/browser";
import {Duplex} from "readable-stream";
import {PortStream} from "./lib/PortStream";

injectTapEventPlugin();

const middleware = redux.compose(redux.applyMiddleware(thunkMiddleware, createLogger()), autoRehydrate());
const store = redux.createStore(reducers, INITIAL_STATE, middleware);
persistStore(store, {
  storage: localForage,
  blacklist: ['runtime']
});

let d = dnode();
let remote: any = null;

if ("serviceWorker" in navigator) {
  // TODO Configure it properly through WebPack
  navigator.serviceWorker.register("worker.bundle.js", {scope: "./"}).then(registration => {
    console.log("REGISTERED", registration);
    let serviceWorker = registration.active;
    let channel = new MessageChannel();
    let workerPort = channel.port2;
    let myPort = channel.port1;
    if (serviceWorker) {
      serviceWorker.postMessage("PUSH_PORT", [workerPort]);
      let workerStream = new PortStream(myPort);
      let workerDnode = dnode({
        didAppend: function (n: any) {
          console.log("didAppend", n)
        }
      });
      workerStream.pipe(workerDnode).pipe(workerStream);
      workerDnode.on("remote", (_remote: any) => {
        remote = _remote;
        remote.hello("foo", (response: any) => {
          console.log("In frame", response);
        });
      })
    }
  }).catch(error => {
    console.log("ERROR", error)
  })
} else {
  alert("ERROR FIXME SW: Browser is not supported");
}

let stream: Duplex | null = null;

function renderFrameApp() {
  let mountPoint = document.getElementById("mount-point");
  if (mountPoint && stream) {
    let nextReducers = require("./frame/reducers").default;
    store.replaceReducer(nextReducers);
    let FrameApp = require("./frame/FrameApp").default;
    let container = React.createElement(AppContainer, undefined, React.createElement(FrameApp, {stream: stream}));
    let provider = React.createElement(Provider, {store: store}, container);
    render(provider, mountPoint);
  } else {
    console.log("ERROR FIXME Pls");
  }
}

window.addEventListener("message", (e) => {
  if (e.data === "PUSH_PORT") {
    let port = e.ports[0];
    stream = new PortStream(port);
    renderFrameApp();
  }
});

window.addEventListener("load", () => {
  let _module = <HotModule>module;

  renderFrameApp();

  if (_module.hot) {
    _module.hot.accept("./ynos/frame/FrameApp.tsx", () => {
      renderFrameApp();
    })
  }
});
