import * as redux from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import reducers from "./frame/reducers";
import {INITIAL_STATE} from "./frame/state";
import localForage from "localforage";
import {PortStream} from "./lib/PortStream";
import {Duplex} from "readable-stream";
import dnode, {Dnode} from "dnode/browser";

function underServiceWorker(self: any): self is ServiceWorkerGlobalScope {
  return true;
}

function isWindowClient(something: any): something is WindowClient {
  return true;
}

let n = 1;
let streams: Array<Duplex> = [];
let remotes: Array<any> = [];

function append(port: MessagePort) {
  console.log("APPEND");
  let stream = new PortStream(port);
  streams.push(stream);
  let d = dnode({
    hello: function (world: string, callback: Function) {
      n += 1;
      console.log(`Got ${world}, n: ${n}`);
      callback(n);
    }
  });
  d.on("remote", (rr: any) => {
    remotes.push(rr);
    remotes.forEach((r: any) => {
      r.didAppend(n);
    });
  });
  stream.pipe(d).pipe(stream);
}

self.addEventListener("message", (e) => {
  if (e.data === "PUSH_PORT") {
    let port = e.ports[0];
    append(port);
  }
});

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

self.addEventListener('activate', e => {

});
