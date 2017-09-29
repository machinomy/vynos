import {PaymentChannel} from "machinomy/lib/channel";
import Payment from "machinomy/lib/Payment";

export default interface VynosBuyResponse {
  channel: PaymentChannel
  token: string
}
