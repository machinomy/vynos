import {Duplex} from 'readable-stream'

export default class ServiceWorkerStream extends Duplex {
  worker: ServiceWorkerGlobalScope

  constructor(worker: ServiceWorkerGlobalScope) {
    super({objectMode: true})
    this.worker = worker
    worker.onmessage = event => {
      this.push(event.data);
    }
  }

  _read(n: number) {
    // Do Nothing
  }

  _write(chunk: any, encoding: any, next: Function) {
    console.log("ServiceWorkerStream", chunk);
    this.worker.clients.matchAll({includeUncontrolled: true}).then(clients => {
      clients.forEach(client => {
        client.postMessage(chunk)
      })
    })
    next();
  }

}
