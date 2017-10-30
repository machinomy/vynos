import {register, ServiceWorkerClient} from './lib/serviceWorkerClient'
import FrameStream from './lib/FrameStream'
import PostStream from './lib/PostStream'
import WorkerProxy from './frame/WorkerProxy'
import renderApplication from './frame/renderApplication'
import {Duplex} from 'readable-stream'

class Client implements ServiceWorkerClient {
  workerStream: PostStream
  windowStream: Duplex
  workerProxy: WorkerProxy

  constructor () {
    this.workerProxy = new WorkerProxy()
    this.windowStream = new FrameStream("vynos").toParent()
  }

  load (serviceWorker: ServiceWorker) {
    this.workerStream = new PostStream({
      sourceName: "frame",
      targetName: "worker",
      source: navigator.serviceWorker,
      target: serviceWorker
    })

    this.windowStream.pipe(this.workerStream).pipe(this.windowStream)

    this.workerStream.pipe(this.workerProxy.provider).pipe(this.workerStream)

    renderApplication(document, this.workerProxy)
  }

  unload () {
    this.windowStream.unpipe(this.workerStream)
    this.workerStream.unpipe(this.windowStream)
    this.workerStream.unpipe(this.workerProxy.provider)
    this.workerProxy.provider.unpipe(this.workerStream)
    this.workerStream.end()
  }
}

window.addEventListener('load', () => {
  let client = new Client()
  register(client)
})
