import Wallet from "ethereumjs-wallet";
import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {RuntimeState} from "../state";
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
  return { ...state,
    wallet: wallet,
    web3: web3,
    machinomyClient: machinomyClient
  };
}

export const doLock = actionCreator<void>('runtime/doLock');
export function doLockHandler(state: RuntimeState): RuntimeState {
  let resultState = Object.assign({}, state);
  delete resultState['wallet'];
  delete resultState['web3'];
  delete resultState['machinomyClient'];
  return resultState;
}
