import { PaymentChannel } from 'machinomy/lib/PaymentChannel'
import * as Web3 from 'web3'
import VynosBuyResponse from './VynosBuyResponse'
import PurchaseMeta from './PurchaseMeta'
import { default as PromisedWalletResponse } from './promised'

export class WalletBuyArguments {
  receiver?: string
  amount?: number
  gateway?: string
  meta?: string
  purchaseMeta?: PurchaseMeta
  channelValue?: number
  tokenContract?: string

  constructor (receiver?: string, amount?: number, gateway?: string, meta?: string, purchaseMeta?: PurchaseMeta, channelValue?: number, tokenContract?: string) {
    this.receiver = receiver || undefined
    this.amount = amount || undefined
    this.gateway = gateway || undefined
    this.meta = meta || undefined
    this.purchaseMeta = purchaseMeta || undefined
    this.channelValue = channelValue || undefined
    this.tokenContract = tokenContract || undefined
  }
}

export default interface Vynos {
  initAccount: () => Promise<void>
  openChannel: (receiverAccount: string, channelValue: BigNumber.BigNumber) => Promise<PaymentChannel>
  depositToChannel: (ch: PaymentChannel) => Promise<PaymentChannel>
  closeChannel: (channelId: string) => Promise<void>
  listChannels: () => Promise<Array<PaymentChannel>>
  buy: (receiver: string, amount: number, gateway: string, meta: string, purchaseMeta?: PurchaseMeta, channelValue?: number, tokenContract?: string) => Promise<VynosBuyResponse>
  buyPromised: (receiver: string, amount: number, gateway: string, meta: string, purchaseMeta?: PurchaseMeta, channelValue?: number, tokenContract?: string) => PromisedWalletResponse
  provider: Web3.Provider
}
