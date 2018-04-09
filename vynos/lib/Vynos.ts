import { PaymentChannel } from 'machinomy/dist/lib/payment_channel'
import YnosPayInChannelResponse from './VynosPayInChannelResponse'
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

  constructor (receiver?: string, amount?: number, gateway?: string, meta?: string, purchaseMeta?: PurchaseMeta, channelValue?: number) {
    this.receiver = receiver || undefined
    this.amount = amount || undefined
    this.gateway = gateway || undefined
    this.meta = meta || undefined
    this.purchaseMeta = purchaseMeta || undefined
    this.channelValue = channelValue || undefined
  }
}

export default interface Vynos {
  initAccount: () => Promise<void>
  openChannel: (receiverAccount: string, channelValue: BigNumber.BigNumber) => Promise<PaymentChannel>
  depositToChannel: (ch: PaymentChannel) => Promise<PaymentChannel>
  closeChannel: (channelId: string) => Promise<void>
  listChannels: () => Promise<Array<PaymentChannel>>
  payInChannel: (ch: PaymentChannel, amount: number, override?: boolean) => Promise<YnosPayInChannelResponse> // FIXME What about lifecycle events? Amount is bignumber, actually.
  buy: (receiver: string, amount: number, gateway: string, meta: string, purchaseMeta?: PurchaseMeta, channelValue?: number) => Promise<VynosBuyResponse>
  buyPromised: (receiver: string, amount: number, gateway: string, meta: string, purchaseMeta?: PurchaseMeta, channelValue?: number) => PromisedWalletResponse
  provider: Web3.Provider
}
