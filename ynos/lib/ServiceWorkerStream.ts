import {Duplex} from "readable-stream";

export default class ServiceWorkerStream extends Duplex {
  serviceWorker: ServiceWorker

  constructor(serviceWorker: ServiceWorker) {
    super({objectMode: true})
    this.serviceWorker = serviceWorker
    navigator.serviceWorker.onmessage = event => {
      this.push(event.data);
    }
  }

  _read(n: number) {
    // Do Nothing
  }

  _write(chunk: any, encoding: any, next: Function) {
    this.serviceWorker.postMessage(chunk)
  }
}
