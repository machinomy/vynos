import * as redux from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import reducers from "./frame/reducers";
import {INITIAL_STATE} from "./frame/state";
import localForage from "localforage";
import {PortStream} from "./lib/PortStream";
import {Duplex, Writable} from "readable-stream";
import dnode, {Dnode} from "dnode/browser";
import PortChannel from "./lib/PortChannel";

let n = 1;

interface FrameInterface {
  didAppend(n: any): void;
}

let serverInterface = {
  hello: function (world: string, callback: Function) {
    n += 1;
    console.log(`Got ${world}, n: ${n}`);
    portChannel.proxy(remote => {
      remote.didAppend(n);
    });
    callback(n);
  }
};

let portChannel = new PortChannel<typeof serverInterface, FrameInterface>(serverInterface);
portChannel.registerServer(self);

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
