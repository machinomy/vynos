import {INITIAL_SHARED_STATE, SharedState} from '../../worker/WorkerState'
import WorkerProxy from '../WorkerProxy'
import {RouterState} from 'react-router-redux'

export interface InitPageState {
  didAcceptTerms: boolean
  mnemonic: string|null
}

export interface TempState {
  workerProxy: WorkerProxy
  initPage: InitPageState
}

export interface FrameState {
  temp: TempState
  shared: SharedState
  router: RouterState
}

export function initialState(workerProxy: WorkerProxy): FrameState {
  return {
    temp: {
      initPage: {
        didAcceptTerms: false,
        mnemonic: null
      },
      workerProxy: workerProxy
    },
    router: {
      location: null
    },
    shared: INITIAL_SHARED_STATE
  }
}
