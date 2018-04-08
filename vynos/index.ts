import Wallet from './embed/Wallet'
import Setup from './embed/Setup'
import * as resourceAddress from './lib/resourceAddress'

let setup = new Setup(resourceAddress.embed(), window)
let wallet = new Wallet(setup.client(), setup.frame())

export default wallet
