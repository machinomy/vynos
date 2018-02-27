import { PaymentChannel, PaymentChannelJSON } from "machinomy/lib/channel";
import YnosPayInChannelResponse from "./VynosPayInChannelResponse";
import Web3 = require("web3")
import VynosBuyResponse from './VynosBuyResponse'
import PurchaseMeta from "./PurchaseMeta";
import {ChannelMeta} from "./storage/ChannelMetaStorage";

export interface WalletBuyArguments {
  receiver: string
  amount: number
  gateway: string
  meta: string
  purchaseMeta: PurchaseMeta
  channelValue?: number
  callbacks ?: BuyProcessCallbacks
}

export interface BuyProcessCallbacks {
  onNoChannelFound ?: (args : WalletBuyArguments) => void
  onChannelFound ?: (args : WalletBuyArguments, channelMeta : ChannelMeta) => void
  onOpeningChannelStarted ?: (args : WalletBuyArguments) => void
  onOpeningChannelFinished ?: (args : WalletBuyArguments, channelMeta : ChannelMeta) => void
  onSentPayment ?: (args : WalletBuyArguments) => void
  onReceivedToken ?: (args : WalletBuyArguments, token : string) => void
  onSentToken ?: (args : WalletBuyArguments, token : string) => void
}

export default interface Vynos {
  provider: Web3.Provider
  openChannel: (receiverAccount: string, channelValue: BigNumber.BigNumber) => Promise<PaymentChannel>
  depositToChannel: (ch: PaymentChannel) => Promise<PaymentChannel>
  closeChannel: (channelId: string) => Promise<void>;
  listChannels: () => Promise<Array<PaymentChannel>>;
  payInChannel: (ch: PaymentChannel, amount: number, override?: boolean) => Promise<YnosPayInChannelResponse> // FIXME What about lifecycle events? Amount is bignumber, actually.
  initAccount: () => Promise<void>
  buy: (receiver: string, amount: number, gateway: string, meta: string, purchaseMeta?: PurchaseMeta, channelValue?: number, callbacks?: BuyProcessCallbacks) => Promise<VynosBuyResponse>
}
