import * as redux from 'redux'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { FrameState, initialState } from './FrameState'
import * as actions from './actions'
import { routerReducer } from 'react-router-redux'
import { topmenu } from './menu'
import WorkerProxy from '../WorkerProxy'

export default function reducers (workerProxy: WorkerProxy): redux.Reducer<FrameState> {
  const state = initialState(workerProxy)

  const tempReducer = reducerWithInitialState(state.temp)
    .case(actions.didAcceptTerms, actions.didAcceptTermsHandler)
    .case(actions.didReceiveMnemonic, actions.didReceiveMnemonicHandler)
    .case(actions.setWorkerProxy, actions.setWorkerProxyHandler)
    .case(actions.clearTempState, actions.clearTempStateHandler)

  const sharedReducer = reducerWithInitialState(state.shared)
    .case(actions.setSharedState, actions.setSharedStateHandler)
    .case(actions.setPending, actions.setPendingHandler)

  return redux.combineReducers({
    router: routerReducer,
    temp: tempReducer,
    shared: sharedReducer,
    menu: topmenu
  })
}
