import * as redux from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import reducers from "./frame/reducers";
import {INITIAL_STATE} from "./frame/state";
import localForage from "localforage";
import * as runtime from "./frame/actions/runtime"
import _ from "lodash";

interface AdapterRequest {
  name: string;
  data: any
}

function isAdapterRequest(data: any): data is AdapterRequest {
  return !!(typeof data === "object" && (data as AdapterRequest).name)
}

function isSWGC(window: any): window is ServiceWorkerGlobalScope {
  return true;
}

const middleware = redux.compose(redux.applyMiddleware(thunkMiddleware, createLogger()), autoRehydrate());
const store = redux.createStore(reducers, INITIAL_STATE, middleware);
persistStore(store, { storage: localForage, blacklist: ['runtime'] });

function broadcastStoreState() {
  let state = store.getState();
  if (isSWGC(self)) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          name: "ServiceWorkerStoreAdapter/getState/broadcast",
          data: _.omit(state, 'runtime.background')
        })
      })
    })
  }
}

store.subscribe(() => {
  if (isSWGC(self)) {
    broadcastStoreState()
  }
});

self.addEventListener('message', ev => {
  let message = ev.data;
  if (isAdapterRequest(message)) {
    switch (message.name) {
      case 'ServiceWorkerStoreAdapter/getState':
        broadcastStoreState();
        break;
      case 'ServiceWorkerStoreAdapter/dispatch':
        let action = message.data;
        store.dispatch(action);
    }
  }
});

self.addEventListener('install', (event: any) => {
  if (isSWGC(self)) {
    event.waitUntil(self.skipWaiting());
  }
});

self.addEventListener('activate', (event: any) => {
  if (isSWGC(self)) {
    event.waitUntil(self.clients.claim());
  }
});
