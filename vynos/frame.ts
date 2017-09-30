import {initServiceWorkerClient} from "./lib/serviceWorkerClient"
import FrameStream from "./lib/FrameStream";
import PostStream from "./lib/PostStream";
import WorkerProxy from "./frame/WorkerProxy";
import renderApplication from "./frame/renderApplication";

let windowStream = new FrameStream("vynos").toParent()

window.addEventListener("load", () => {
  initServiceWorkerClient((serviceWorker, onUnload) => {
    let workerStream = new PostStream({
      sourceName: "frame",
      targetName: "worker",
      source: navigator.serviceWorker,
      target: serviceWorker
    })

    windowStream.pipe(workerStream).pipe(windowStream)

    let workerProxy = new WorkerProxy()
    workerStream.pipe(workerProxy.stream).pipe(workerStream)

    renderApplication(document, workerProxy)

    onUnload(() => {
      windowStream.unpipe(workerStream)
      workerStream.unpipe(windowStream)
      workerStream.unpipe(workerProxy.stream)
      workerProxy.stream.unpipe(workerStream)

      windowStream.end()
      workerStream.end()
      workerProxy.stream.end()
    })
  })
});
