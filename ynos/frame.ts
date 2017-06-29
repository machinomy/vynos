import {initServiceWorkerClient} from "./lib/serviceWorkerClient"
import FrameStream from "./lib/FrameStream";
import PostStream from "./lib/PostStream";

initServiceWorkerClient(serviceWorker => {
  let stream = new PostStream({
    sourceName: "frame",
    targetName: "worker",
    source: navigator.serviceWorker,
    target: serviceWorker
  })

  stream.on("data", chunk => {
    console.log("got fresh data")
    console.log(chunk)
  })
  stream.write({
    id: "1",
    jsonrpc: "2.0",
    method: "ff",
    params: null
  })
})


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

window.addEventListener("load", () => {
  let frameStream = new FrameStream("ynos").toParent()
  frameStream.on("data", chunk => {
    console.log("frame.frameStream received chunk", chunk)
  })
  let _module = <HotModule>module;

  renderFrameApp();

  if (_module.hot) {
    _module.hot.accept("./ynos/frame/FrameApp.tsx", () => {
      renderFrameApp();
    })
  }
});
