import Web3 from 'web3'
import machinomy from 'machinomy'

export interface MachinomyWindowExt {
  BROWSER?: boolean
  MACHINOMY_NETWORK?: string
  LOGLEVEL?: string
}

let _window = self as MachinomyWindowExt

export const buildMachinomyClient = (web3: Web3, account: string) => {
  console.log("buildMachinomyClient", account)
  const MACHINOMY_NETWORK = 'ropsten'
  _window.BROWSER = true
  _window.MACHINOMY_NETWORK = MACHINOMY_NETWORK
  _window.LOGLEVEL = 'debug'
  let transport = machinomy.transport.build()
  let storage = machinomy.storage.build(web3, `literate.${MACHINOMY_NETWORK}`, 'sender')
  let contract = machinomy.contract(web3)
  return machinomy.sender.build(web3, account, contract, transport, storage)
}
