import actionCreatorFactory, {ActionCreator} from 'typescript-fsa'
import {SharedState} from '../../worker/WorkerState'
import {Store} from 'redux'
import {FrameState, TempState} from './FrameState'

const actionCreator = actionCreatorFactory("frame");

export type SetSharedStateArgs = {
  sharedState: SharedState,
  store: Store<FrameState>
}
export const setSharedState: ActionCreator<SetSharedStateArgs> = actionCreator<SetSharedStateArgs>("shared/setSharedState");
export function setSharedStateHandler(state: SharedState, {sharedState, store}: SetSharedStateArgs): SharedState {
  return sharedState
}

export const didAcceptTerms: ActionCreator<boolean> = actionCreator<boolean>("temp/didAcceptTerms");
export function didAcceptTermsHandler(state: TempState, accepted: boolean): TempState {
  return { ...state, initPage: { ...state.initPage, didAcceptTerms: accepted }}
}

export const didReceiveMnemonic: ActionCreator<string> = actionCreator<string>("temp/didReceiveMnemonic");
export function didReceiveMnemonicHandler(state: TempState, mnemonic: string): TempState {
  return { ...state, initPage: { ...state.initPage, mnemonic: mnemonic }}
}
