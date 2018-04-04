import { PaymentChannel } from 'machinomy/dist/lib/payment_channel'
import Payment from 'machinomy/dist/lib/Payment'

export default interface VynosPayInChannelResponse {
  channel: PaymentChannel
  payment: Payment
}
