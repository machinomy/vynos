import {Duplex} from 'readable-stream'

export interface ServiceWorkerStreamOptions {
  sourceName: string
  targetName: string
  source: ServiceWorkerGlobalScope
}

export default class ServiceWorkerStream extends Duplex {
  source: ServiceWorkerGlobalScope
  targetName: string
  sourceName: string

  constructor(options: ServiceWorkerStreamOptions) {
    super({objectMode: true})
    this.source = options.source
    this.targetName = options.targetName
    this.sourceName = options.sourceName

    this.source.addEventListener('message', this.onMessage.bind(this), false)
  }

  onMessage (event: MessageEvent) {
    let message = event.data
    if (typeof message === 'object' && message.target === this.sourceName && message.data) {
      try {
        this.push(message.data)
      } catch (error) {
        this.emit('error', error)
      }
    }
  }

  _read(n: number) {
    // Do Nothing
  }

  _write(data: any, encoding: any, next: Function) {
    let message = {
      target: this.targetName,
      data: data
    };
    this.source.clients.matchAll({includeUncontrolled: true}).then(clients => {
      clients.forEach(client => {
        client.postMessage(message)
      })
    })
    next();
  }

}
