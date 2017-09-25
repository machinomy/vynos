import * as redux from "redux";
import {createLogger} from "redux-logger";
import WorkerProxy from "../WorkerProxy";
import RemoteStore from "../lib/RemoteStore";
import {rootReducers} from '../reducers/state'
import {setWorkerProxy} from "../actions/temp";

import {INITIAL_FRAME_STATE} from "../reducers/state"

export default function configureStore(workerProxy:WorkerProxy, frameState:any) {
    let middleware = redux.applyMiddleware(createLogger())
    let store = redux.createStore(rootReducers, INITIAL_FRAME_STATE, middleware)
    let remoteStore = new RemoteStore(workerProxy, frameState)
    remoteStore.wireToLocal(store)
    store.dispatch(setWorkerProxy(workerProxy))

    return store;
}