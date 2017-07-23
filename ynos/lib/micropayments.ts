import Web3 from 'web3'
import machinomy from 'machinomy'
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
  let transport = machinomy.transport.build()
  let storage = machinomy.storage.build(web3, `literate.${MACHINOMY_NETWORK}`, 'sender')
  console.log(_window.CONTRACT_ADDRESS)
  let contract = machinomy.contract(web3, _window.CONTRACT_ADDRESS)
  return new Sender(web3, account, contract, transport, storage)
}
