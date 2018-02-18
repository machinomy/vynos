import {ChannelId, PaymentChannel} from "machinomy/lib/channel";
import Payment from "machinomy/lib/Payment";

export default interface VynosBuyResponse {
  channelId: string
  token: string
}
