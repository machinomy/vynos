import {Duplex} from "readable-stream";
import {PortStream} from "./lib/PortStream";
import ServiceWorkerClientStream from "./lib/ServiceWorkerClientStream";
import {initServiceWorkerClient} from "./lib/serviceWorkerClient"

initServiceWorkerClient(serviceWorker => {
  console.log("setup for ", serviceWorker)
  let streamS = new ServiceWorkerClientStream(serviceWorker);
  streamS.on("data", chunk => {
    console.log("got fresh data")
    console.log(chunk)
  })
  streamS.write({
    id: "1",
    jsonrpc: "2.0",
    method: "ff",
    params: null
  })
})


let stream: Duplex | null = null;

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

window.addEventListener("message", (e) => {
  if (e.data === "PUSH_PORT") {
    let port = e.ports[0];
    stream = new PortStream(port);
    renderFrameApp();
  }
});

window.addEventListener("load", () => {
  let _module = <HotModule>module;

  renderFrameApp();

  if (_module.hot) {
    _module.hot.accept("./ynos/frame/FrameApp.tsx", () => {
      renderFrameApp();
    })
  }
});
