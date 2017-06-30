import Wallet from "ethereumjs-wallet";
import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {RuntimeState} from "../astate";
import * as eth from "../lib/eth";
import * as micropayments from "../lib/micropayments";

const actionCreator = actionCreatorFactory();

export const setMnemonic: ActionCreator<string> = actionCreator<string>('runtime/setMnemonic');
export function setMnemonicHandler(state: RuntimeState, mnemonic: string): RuntimeState {
  return { ...state, mnemonic: mnemonic };
}

export const setWallet: ActionCreator<Wallet> = actionCreator<Wallet>('runtime/setWallet');
export function setWalletHandler(state: RuntimeState, wallet: Wallet): RuntimeState {
  let web3 = eth.buildWeb3(wallet);
  let account = wallet.getAddressString();
  let machinomyClient = micropayments.buildMachinomyClient(web3, account);
  let nextState = Object.assign({}, state);
  nextState.background.wallet = wallet;
  nextState.background.web3 = web3;
  nextState.background.machinomyClient = machinomyClient;
  return nextState;
}

export const doLock = actionCreator<void>('runtime/doLock');
export function doLockHandler(state: RuntimeState): RuntimeState {
  let resultState = Object.assign({}, state);
  delete resultState.background['wallet'];
  delete resultState.background['web3'];
  delete resultState.background['machinomyClient'];
  return resultState;
}
