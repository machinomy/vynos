import {initServiceWorkerClient} from "./lib/serviceWorkerClient"
import FrameStream from "./lib/FrameStream";
import PostStream from "./lib/PostStream";
import StreamServer, {Handler} from "./lib/StreamServer";
import {RequestPayload} from "./lib/Payload";

function renderFrameApp() {
  return;
  /*
  let mountPoint = document.getElementById("mount-point");
  if (mountPoint && stream) {
    let nextReducers = require("./frame/reducers").default;
    store.replaceReducer(nextReducers);
    let FrameApp = require("./frame/FrameApp").default;
    let container = React.createElement(AppContainer, undefined, React.createElement(FrameApp, {stream: stream}));
    let provider = React.createElement(Provider, {store: store}, container);
    render(provider, mountPoint);
  } else {
    console.log("ERROR FIXME Pls");
  }
  */
}

const blahHandler: Handler = (message: RequestPayload, next, end) => {
  if (message.id >= 500 && message.method == "blah") {
    end(null, {
      id: message.id,
      jsonrpc: message.jsonrpc,
      result: ["Hi from blah frame!"]
    })
  } else {
    next();
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

    let streamServer = new StreamServer();
    streamServer.add(blahHandler)

    windowStream.pipe(streamServer).pipe(workerStream).pipe(windowStream)

    onUnload(() => {
      windowStream.unpipe(streamServer)
      streamServer.unpipe(workerStream)
      workerStream.unpipe(windowStream)

      windowStream.end()
      workerStream.end()
      streamServer.end()
    })

    /*
    workerStream.on("data", chunk => {
      console.log("got fresh data")
      console.log(chunk)
    })
    workerStream.write({
      id: "1",
      jsonrpc: "2.0",
      method: "ff",
      params: null
    })


    windowStream.on("data", chunk => {
      console.log("frame.frameStream received chunk", chunk)
    })*/

    let _module = <HotModule>module;
    renderFrameApp();
    if (_module.hot) {
      _module.hot.accept("./ynos/frame/FrameApp.tsx", () => {
        renderFrameApp();
      })
    }
  })
});
