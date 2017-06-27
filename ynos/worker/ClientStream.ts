import {Duplex} from 'readable-stream'

export default class ClientStream extends Duplex {
  worker: ServiceWorkerGlobalScope

  constructor(worker: ServiceWorkerGlobalScope) {
    super({objectMode: true})
    this.worker = worker
    this.worker.onmessage = event => {
      this.push(event.data);
    }
  }

  _read(n: number) {
    // Do Nothing
  }

  _write(chunk: any, encoding: any, next: Function) {
    this.worker.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage(chunk)
      })
    })
  }

}
