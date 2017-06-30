import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import WorkerProxy from "../WorkerProxy";
import {TempState} from "../state";

const actionCreator = actionCreatorFactory("temp");

export const setWorkerProxy: ActionCreator<WorkerProxy> = actionCreator<WorkerProxy>("setWorkerProxy");
export function setWorkerProxyHandler(state: TempState, workerProxy: WorkerProxy): TempState {
  return { ...state, workerProxy: workerProxy };
}
