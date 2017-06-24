import * as redux from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import reducers from "./frame/reducers";
import {INITIAL_STATE} from "./frame/state";
import localForage from "localforage";

function underServiceWorker(self: any): self is ServiceWorkerGlobalScope {
  return true;
}

function isWindowClient(something: any): something is WindowClient {
  return true;
}


self.addEventListener('install', e => {
  /*
   const middleware = redux.compose(redux.applyMiddleware(thunkMiddleware, createLogger()), autoRehydrate());
   const store = redux.createStore(reducers, INITIAL_STATE, middleware);
   persistStore(store, {
   storage: localForage,
   blacklist: ['runtime']
   });
   */
});

self.addEventListener("message", (e: MessageEvent) => {
  console.log("Received Message", e);
  console.log(e.source);
  console.log("Doing Pong");
  if (underServiceWorker(self)) {
    self.clients.matchAll({type: "all"}).then(clients => {
      console.log("Clients", clients);
    });
  }
  if (isWindowClient(e.source)) {
    e.source.postMessage(`PONG ${e.data.toString()}`);
  }
});

self.addEventListener('activate', e => {
  console.log('Activate event:', e);
});
