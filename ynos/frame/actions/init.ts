import actionCreatorFactory, {ActionCreator, AsyncActionCreators} from "typescript-fsa";
import { bindThunkAction } from "typescript-fsa-redux-thunk";
import {InitState} from "../state";
import bip39 from "bip39";
import {Dispatch} from "redux";
import hdkey from "ethereumjs-wallet/hdkey";
import * as runtime from "./runtime";
import Keyring from "../lib/Keyring";
import {ThunkAction} from "redux-thunk";

const actionCreator = actionCreatorFactory();

export const acceptTerms: ActionCreator<Date> = actionCreator<Date>("init/acceptTerms");
export function acceptTermsHandler(state: InitState, date: Date): InitState {
  return { ...state, didAcceptTerms: date.toISOString() };
}

export const setKeyring = actionCreator<string>("init/setKeyring");
export function setKeyringHandler(state: InitState, keyring: string): InitState {
  return { ...state, keyring: keyring };
}

export const didStoreSeed = actionCreator<Date>("init/didStoreSeed");
export function didStoreSeedHandler(state: InitState, date: Date): InitState {
  return { ...state, didStoreSeed: date.toISOString() };
}

export type GenerateKeyringArguments = {
  mnemonic: string;
  password: string;
}
export const generateKeyringCreator = actionCreator.async<GenerateKeyringArguments, undefined>("init/generateKeyringCreator");
export const generateKeyring = bindThunkAction(generateKeyringCreator,
  async (args, dispatch) => {
    let mnemonic = args.mnemonic;
    let password = args.password;
    let seed = bip39.mnemonicToSeed(mnemonic, password);
    let wallet = hdkey.fromMasterSeed(seed).getWallet();
    dispatch(runtime.setWallet(wallet));
    let privateKey = wallet.getPrivateKey();
    let keyring = new Keyring(privateKey);
    Keyring.serialize(keyring, password).then(serialized => {
      dispatch(setKeyring(serialized))
    })
  });
