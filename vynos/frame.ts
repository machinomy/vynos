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

  load (serviceWorker: ServiceWorker) {
    console.log('Client.load')
    this.windowStream = new FrameStream("vynos").toParent()
    this.workerStream = new PostStream({
      sourceName: "frame",
      targetName: "worker",
      source: navigator.serviceWorker,
      target: serviceWorker
    })

    this.windowStream.pipe(this.workerStream).pipe(this.windowStream)

    this.workerProxy = new WorkerProxy()
    this.workerStream.pipe(this.workerProxy.provider).pipe(this.workerStream)

    renderApplication(document, this.workerProxy)
  }

  unload () {
    console.log('Client.unload')
    this.windowStream.unpipe(this.workerStream)
    this.workerStream.unpipe(this.windowStream)
    this.workerStream.unpipe(this.workerProxy.provider)
    this.workerProxy.provider.unpipe(this.workerStream)

    this.windowStream.end()
    this.workerStream.end()
    this.workerProxy.provider.end()
  }
}

window.addEventListener('load', () => {
  let client = new Client()
  register(client)
})
