import React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import localForage from "localforage";
import { persistStore, autoRehydrate } from "redux-persist";
import {Provider, Store} from "react-redux";
import * as redux from "redux";
import reducers from "./frame/reducers";
import {INITIAL_STATE, State} from "./frame/state";
import FrameStream from "./lib/FrameStream";
import injectTapEventPlugin from "react-tap-event-plugin";
import PostStream from "./lib/PostStream";
import dnode, {Dnode} from "dnode/browser";
import {Duplex} from "readable-stream";
import {PortStream} from "./lib/PortStream";
import {Action} from "redux";
import {EventEmitter} from "events";
import Promise from "bluebird";
import ServiceWorkerClientStream from "./lib/ServiceWorkerClientStream";

injectTapEventPlugin();

/*
const middleware = redux.compose(redux.applyMiddleware(thunkMiddleware, createLogger()), autoRehydrate());
const store = redux.createStore(reducers, INITIAL_STATE, middleware);
persistStore(store, {
  storage: localForage,
  blacklist: ['runtime']
});
*/

interface AdapterRequest {
  name: string;
  data: any
}

function isAdapterRequest(data: any): data is AdapterRequest {
  return !!(typeof data === "object" && (data as AdapterRequest).name)
}

class ServiceWorkerProvider {
  sw: ServiceWorker;

  constructor(sw: ServiceWorker) {
    this.sw = sw;
  }

  getAddressString(): Promise<string> {
    return this.ask({name: "getAddressString", data: null}).then(r => {
      return r.data as string;
    })
  }

  ask(r: AdapterRequest): Promise<AdapterRequest> {
    return new Promise((resolve, reject) => {
      this.sw.postMessage(r);
      navigator.serviceWorker.addEventListener("message", initialState);

      function initialState(ev: MessageEvent) {
        let message = ev.data;
        if (isAdapterRequest(message)) {
          if (message.name === r.name + "/response") {
            resolve(message);
            navigator.serviceWorker.removeEventListener("message", initialState);
          }
        }
      }
    })
  }
}

class ServiceWorkerStore implements Store<State> {
  sw: ServiceWorker;
  state: State;
  eventEmitter: EventEmitter;

  constructor(sw: ServiceWorker, initialState: State) {
    this.sw = sw;
    this.state = initialState;
    this.eventEmitter = new EventEmitter();
    let self = this;
    navigator.serviceWorker.addEventListener("message", updateState);
    function updateState(ev: MessageEvent) {
      let message = ev.data;
      if (isAdapterRequest(message)) {
        if (message.name === "ServiceWorkerStoreAdapter/getState/broadcast") {
          self.state = message.data as State;
          self.eventEmitter.emit("update");
        }
      }
    }

    this.dispatch = this.dispatch.bind(this);
  }

  dispatch<A extends Action>(action: A): A {
    this.sw.postMessage({
      name: "ServiceWorkerStoreAdapter/dispatch",
      data: action
    });
    return action;
  }

  getState(): State {
    return this.state;
  }

  subscribe(listener: () => void): redux.Unsubscribe {
    this.eventEmitter.on("update", listener);
    return () => {
      this.eventEmitter.removeListener("update", listener);
    }
  }

  replaceReducer(nextReducer: redux.Reducer<State>): void {
    throw new Error("Method not implemented.");
  }
}

function buildStore(sw: ServiceWorker): Promise<ServiceWorkerStore> {
  return new Promise((resolve, reject) => {
    let request = { name: "ServiceWorkerStoreAdapter/getState" };
    sw.postMessage(request);
    navigator.serviceWorker.addEventListener("message", initialState);

    function initialState(ev: MessageEvent) {
      let message = ev.data;
      if (isAdapterRequest(message)) {
        if (message.name === "ServiceWorkerStoreAdapter/getState/broadcast") {
          let state = message.data as State;
          let swStore = new ServiceWorkerStore(sw, state);
          resolve(swStore);
          navigator.serviceWorker.removeEventListener("message", initialState);
        }
      }
    }
  });
}

function setupStream(serviceWorker: ServiceWorker) {
  console.log("setup for ", serviceWorker)
  let streamS = new ServiceWorkerClientStream(serviceWorker);
  streamS.on("data", chunk => {
    console.log("got fresh data")
    console.log(chunk)
  })
  streamS.write({
    id: "1",
    jsonrpc: "2.0",
    method: "ff",
    params: null
  })
}

function initServiceWorker(fn: (sw: ServiceWorker) => void) {
  const isServiceWorker = (s: any): s is ServiceWorker => true
  const extractServiceWorker = (r: ServiceWorkerRegistration, fn: (sw: ServiceWorker) => void) => {
    let serviceWorker = r.active || r.installing || r.waiting;
    if (serviceWorker) {
      fn(serviceWorker)
    }
  }
  const freshInstall = (sw: ServiceWorker) => {
    const statechange = (e: Event) => {
      console.log(e)
      if (isServiceWorker(e.target)) {
        console.log(e.target)
        console.log(e.target.state)
        if (e.target.state === "activated") {
          fn(e.target)
          sw.removeEventListener("statechange", statechange)
        }
      }
    }
    sw.addEventListener("statechange", statechange)
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("worker.bundle.js", {scope: "./"}).then(registration => {
      registration.onupdatefound = () => {
        console.log("onupdatefound")
        extractServiceWorker(registration, sw => {
          freshInstall(sw)
        })
      }
      extractServiceWorker(registration, sw => {
        freshInstall(sw)
        fn(sw)
      })
    }).catch(error => {
      console.log("ERROR", error)
    })
  } else {
    console.log("ERROR FIXME SW: Browser is not supported");
  }
}

initServiceWorker(sw => {
  setupStream(sw)
})



let stream: Duplex | null = null;

function renderFrameApp() {
  return;
  /*
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
  */
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
