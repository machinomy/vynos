import {initServiceWorkerClient} from "./lib/serviceWorkerClient"
import FrameStream from "./lib/FrameStream";
import PostStream from "./lib/PostStream";
import WorkerProxy from "./frame/WorkerProxy";

function renderFrameApplication(workerProxy: WorkerProxy) {
  function attach() {
    let render = require("./frame/FrameApplication").render
    render(document, workerProxy)
  }

  let hotReload = (module as HotModule).hot
  if (hotReload) {
    attach()
    hotReload.accept("./ynos/frame/FrameApplication.tsx", () => {
      attach()
    })
  }
}

window.addEventListener("load", () => {
  initServiceWorkerClient((serviceWorker, onUnload) => {
    let workerStream = new PostStream({
      sourceName: "frame",
      targetName: "worker",
      source: navigator.serviceWorker,
      target: serviceWorker
    })
    let windowStream = new FrameStream("ynos").toParent()

    windowStream.pipe(workerStream)
    workerStream.pipe(windowStream)

    let workerProxy = new WorkerProxy()
    workerStream.pipe(workerProxy.stream)
    workerProxy.stream.pipe(workerStream)

    renderFrameApplication(workerProxy)

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
