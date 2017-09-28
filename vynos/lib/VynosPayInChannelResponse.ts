import {PaymentChannel} from "machinomy/lib/channel";
import Payment from "machinomy/lib/Payment";

export default interface VynosPayInChannelResponse {
  channel: PaymentChannel
  payment: Payment
}
