import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import WorkerProxy from "../WorkerProxy";
import {TempState} from "../state/FrameState";
import * as initActions from "./temp/init"

const actionCreator = actionCreatorFactory("frame/temp");

export const setWorkerProxy: ActionCreator<WorkerProxy> = actionCreator<WorkerProxy>("setWorkerProxy");
export function setWorkerProxyHandler(state: TempState, workerProxy: WorkerProxy): TempState {
  return { ...state, workerProxy: workerProxy };
}

export const init = initActions
