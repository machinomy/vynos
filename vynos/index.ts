import Wallet from './embed/Wallet'
import Setup from './embed/Setup'
import * as resourceAddress from './lib/resourceAddress'

let setup = new Setup(resourceAddress.embed(), window)
let wallet = new Wallet(setup.client(), setup.frame())

export { WalletBuyArguments } from './lib/Vynos'
export { BuyProcessEvent } from './lib/rpc/buyProcessEventBroadcast'
export { ChannelMeta } from './lib/storage/ChannelMetaStorage'
export { default as PromisedWalletResponse } from './lib/promised'
export { default as VynosBuyResponse } from './lib/VynosBuyResponse'

export default wallet
