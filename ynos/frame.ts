import {initServiceWorkerClient} from "./lib/serviceWorkerClient"
import FrameStream from "./lib/FrameStream";
import PostStream from "./lib/PostStream";

window.addEventListener("load", () => {
  initServiceWorkerClient((serviceWorker, onUnload) => {
    let workerStream = new PostStream({
      sourceName: "frame",
      targetName: "worker",
      source: navigator.serviceWorker,
      target: serviceWorker
    })
    let windowStream = new FrameStream("ynos").toParent()

    windowStream.pipe(workerStream).pipe(windowStream)

    onUnload(() => {
      workerStream.unpipe(windowStream)
      windowStream.unpipe(workerStream)

      windowStream.end()
      workerStream.end()
    })
  })
});
