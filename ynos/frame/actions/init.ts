import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {InitState} from "../state";

const actionCreator = actionCreatorFactory();

export const acceptTerms: ActionCreator<Date> = actionCreator<Date>('init/acceptTerms');
export function acceptTermsHandler(state: InitState, date: Date): InitState {
  return { ...state, didAcceptTerms: date.toISOString() };
}

export const setKeyring = actionCreator<string>('init/setKeyring');
export function setKeyringHandler(state: InitState, keyring: string): InitState {
  return { ...state, keyring: keyring };
}
