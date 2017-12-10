import { PaymentChannel, PaymentChannelJSON } from "machinomy/lib/channel";
import Promise = require('bluebird')
import YnosPayInChannelResponse from "./VynosPayInChannelResponse";
import Web3 = require("web3")
import VynosBuyResponse from './VynosBuyResponse'
import PurchaseMeta from "./PurchaseMeta";

export default interface Vynos {
  provider: Web3.Provider
  openChannel: (receiverAccount: string, channelValue: BigNumber.BigNumber) => Promise<PaymentChannel>
  depositToChannel: (ch: PaymentChannel) => Promise<PaymentChannel>
  closeChannel: (channelId: string) => Promise<void>;
  listChannels: () => Promise<Array<PaymentChannel>>;
  payInChannel: (ch: PaymentChannel, amount: number, override?: boolean) => Promise<YnosPayInChannelResponse> // FIXME What about lifecycle events? Amount is bignumber, actually.
  initAccount: () => Promise<void>
  buy: (receiver: string, amount: number, gateway: string, meta: string, purchaseMeta?: PurchaseMeta) => Promise<VynosBuyResponse>
}
