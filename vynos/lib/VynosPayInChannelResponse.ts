import { PaymentChannel } from 'machinomy/dist/lib/channel'
import Payment from 'machinomy/dist/lib/Payment'

export default interface VynosPayInChannelResponse {
  channel: PaymentChannel
  payment: Payment
}
