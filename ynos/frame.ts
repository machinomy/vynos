import React from "react";
import {render} from "react-dom";
import { AppContainer } from "react-hot-loader";

function renderFrameApp() {
  let mountPoint = document.getElementById("mount-point");
  if (mountPoint) {
    let FrameApp = require("./frame/FrameApp").default;
    let container = React.createElement(AppContainer, undefined, React.createElement(FrameApp));
    render(container, mountPoint);
  } else {
    console.log("ERROR FIXME Pls");
  }
}

window.addEventListener("load", () => {
  interface HotReload {
    accept: (componentPath: string, callback: () => void) => void
  }

  interface HotModule extends NodeModule {
    hot: HotReload
  }

  let _module = <HotModule>module;

  renderFrameApp();

  if (_module.hot) {
    _module.hot.accept("./ynos/frame/FrameApp.tsx", () => {
      renderFrameApp();
    })
  }
});
