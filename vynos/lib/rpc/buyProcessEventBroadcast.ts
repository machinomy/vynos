import { ResponsePayload } from '../Payload'
import { WalletBuyArguments } from '../Vynos'
import { ChannelMeta } from '../storage/ChannelMetaStorage'

export const buyProcessEventBroadcastType = 'worker/broadcast/buyProcessEvent'

export enum BuyProcessEvent {
  NONE = '',
  NO_CHANNEL_FOUND = 'buyProcessNoChannelFound',
  CHANNEL_FOUND = 'buyProcessChannelFound',
  OPENING_CHANNEL_STARTED = 'buyProcessOpeningChannelStarted',
  OPENING_CHANNEL_FINISHED = 'buyProcessOpeningChannelFinished',
  SENT_PAYMENT = 'buyProcessSentPayment',
  RECEIVED_TOKEN = 'buyProcessReceivedToken',
  SENT_TOKEN = 'buyProcessSentToken'
}

export function buyProcessEvent (buyProcessEvent: BuyProcessEvent, args: WalletBuyArguments): string {
  return `event:buyProcessEvent:${buyProcessEvent}:${args.receiver}:${args.amount}:${args.gateway}:${args.meta}:${args.purchaseMeta}`
}

export interface BuyProcessEventBroadcast extends ResponsePayload {
  id: string,
  type: BuyProcessEvent,
  result: [WalletBuyArguments, string, ChannelMeta]
}

export function isBuyProcessEventBroadcast (data: Object): data is BuyProcessEventBroadcast {
  let probablyBroadcast = (data as BuyProcessEventBroadcast)
  return probablyBroadcast.id === buyProcessEventBroadcastType
}
