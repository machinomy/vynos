import Namespace from '../inpage/Namespace'
import { Duplex } from 'readable-stream'

export default class NamespaceEventsController {
  constructor(vynosClient: Namespace, stream: Duplex) {
    stream.on('data', (chunk: any) => {
      if (chunk.id == 'worker/broadcast/SharedState') {
        if (chunk.result.isTransactionPending) {
          vynosClient.display()
        }
      }
    })
  }
}
