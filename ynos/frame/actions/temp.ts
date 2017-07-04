import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import WorkerProxy from "../WorkerProxy";
import {TempState} from "../state";
import * as initActions from "./temp/init"
import Web3 from "web3"

const actionCreator = actionCreatorFactory("frame/temp");

export const setWorkerProxy: ActionCreator<WorkerProxy> = actionCreator<WorkerProxy>("setWorkerProxy");
export function setWorkerProxyHandler(state: TempState, workerProxy: WorkerProxy): TempState {
  return { ...state, workerProxy: workerProxy };
}

export const setWeb3: ActionCreator<Web3> = actionCreator<Web3>("setWeb3")
export function setWeb3Handler(state: TempState, web3: Web3): TempState {
  return { ...state, web3: web3 }
}

export const init = initActions
