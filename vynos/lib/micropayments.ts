import Web3 =require('web3')
import * as transport from "machinomy/lib/transport"
import * as storage from "machinomy/lib/storage"
import * as channel from "machinomy/lib/channel"
import Sender from "machinomy/lib/sender";

export interface MachinomyWindowExt {
  BROWSER?: boolean
  MACHINOMY_NETWORK?: string
  LOGLEVEL?: string,
  CONTRACT_ADDRESS?: string
}

let _window = self as MachinomyWindowExt

export const buildMachinomyClient = (web3: Web3, account: string) => {
  const MACHINOMY_NETWORK = 'ropsten'
  _window.BROWSER = true
  _window.MACHINOMY_NETWORK = MACHINOMY_NETWORK
  _window.LOGLEVEL = 'debug'
  let _transport = transport.build()
  let _storage = storage.build(web3, `literate.${MACHINOMY_NETWORK}`, 'sender')
  let contract = channel.contract(web3, _window.CONTRACT_ADDRESS)
  return new Sender(web3, account, contract, _transport, _storage)
}
