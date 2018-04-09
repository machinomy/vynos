import { ResponsePayload } from '../Payload'

export const DisplayRequestBroadcastType = 'worker/broadcast/DisplayRequest'

export interface DisplayRequestBroadcast extends ResponsePayload {
  id: typeof DisplayRequestBroadcastType,
  result: boolean
}
