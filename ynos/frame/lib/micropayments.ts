import * as Web3 from "web3"
import {Sender} from "machinomy";
import * as machinomy from "machinomy";

interface MachinomyWindow extends Window {
  BROWSER: boolean;
  MACHINOMY_NETWORK: string;
  LOGLEVEL: string;
}

export function buildMachinomyClient (web3: Web3, account: string): Sender {
  const MACHINOMY_NETWORK = 'ropsten';
  let _window = window as MachinomyWindow;
  _window.BROWSER = true;
  _window.MACHINOMY_NETWORK = MACHINOMY_NETWORK;
  _window.LOGLEVEL = 'debug';
  let transport = machinomy.transport.build();
  let storage = machinomy.storage.build(web3, `literate.${MACHINOMY_NETWORK}`, 'sender');
  let contract = machinomy.contract(web3);
  return machinomy.sender.build(web3, account, contract, transport, storage)
}
