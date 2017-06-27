import {Duplex} from "readable-stream";

export default class ServiceWorkerClientStream extends Duplex {
  serviceWorker: ServiceWorker

  constructor(serviceWorker: ServiceWorker) {
    super({objectMode: true})
    this.serviceWorker = serviceWorker
    navigator.serviceWorker.addEventListener("message", (event: MessageEvent) => {
      this.push(event.data);
    })
  }

  _read(n: number) {
    // Do Nothing
  }

  _write(chunk: any, encoding: any, next: Function) {
    this.serviceWorker.postMessage(chunk)
  }
}
