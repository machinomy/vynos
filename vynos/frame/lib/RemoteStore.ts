import {Store} from "react-redux";
import {SharedState} from "../../worker/WorkerState";
import WorkerProxy from "../WorkerProxy";
import {EventEmitter} from "events";
import {SharedStateBroadcastType, SharedStateBroadcast} from "../../lib/rpc/SharedStateBroadcast";
import {Action, Dispatch, Reducer, Unsubscribe} from "redux";
import {FrameState} from "../redux/FrameState";
import {setSharedState} from "../redux/actions";

export default class RemoteStore implements Store<SharedState> {
  workerProxy: WorkerProxy
  state: SharedState
  eventEmitter: EventEmitter

  constructor(workerProxy: WorkerProxy, initial: SharedState) {
    this.workerProxy = workerProxy
    this.state = initial
    this.eventEmitter = new EventEmitter()
    this.workerProxy.addListener(SharedStateBroadcastType, this.onSharedStateBroadcast.bind(this))
    this.dispatch = this.dispatch.bind(this)
  }

  onSharedStateBroadcast(data: SharedStateBroadcast) {
    this.state = data.result
    this.eventEmitter.emit("update");
  }

  dispatch<A extends Action>(action: A): A {
    this.workerProxy.dispatch(action)
    return action
  }

  getState(): SharedState {
    return this.state;
  }

  subscribe(listener: () => void): Unsubscribe {
    this.eventEmitter.addListener("update", listener);
    return () => {
      this.eventEmitter.removeListener("update", listener);
    }
  }

  replaceReducer(nextReducer: Reducer<SharedState>): void {
    // Do Nothing
  }

  wireToLocal(store: Store<FrameState>) {
    this.subscribe(() => {
      store.dispatch(setSharedState({sharedState: this.getState(), store: store}))
    })
    store.dispatch(setSharedState({sharedState: this.getState(), store: store}))
  }
}
