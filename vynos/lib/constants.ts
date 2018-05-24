const networks = {
  MAIN: 'https://mainnet.infura.io/T1S8a0bkyrGD7jxJBgeH',
  ROPSTEN: 'https://ropsten.infura.io/T1S8a0bkyrGD7jxJBgeH',
  RINKEBY: 'https://rinkeby.infura.io/T1S8a0bkyrGD7jxJBgeH'
}

const CHANGE_NETWORK = 'changeNetwork'
const DISPLAY_REQUEST = 'displayRequest'
const CHANGE_NETWORK_FOR_MICROPAYMENT_CONTROLLER = 'changeNetworkForMicropaymentController'
const NETWORK_CONTROLLER_WEB3_HAS_BEEN_INITIALIZED = 'networkControllerWeb3HasBeenInitialized'

export { networks, CHANGE_NETWORK, DISPLAY_REQUEST, CHANGE_NETWORK_FOR_MICROPAYMENT_CONTROLLER, NETWORK_CONTROLLER_WEB3_HAS_BEEN_INITIALIZED }
