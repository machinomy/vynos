import React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import {Provider} from "react-redux";
import * as redux from "redux";
import reducers from "./frame/reducers";
import {INITIAL_STATE} from "./frame/state";

function renderFrameApp() {
  let mountPoint = document.getElementById("mount-point");
  if (mountPoint) {
    const middleware = redux.compose(redux.applyMiddleware(thunkMiddleware, createLogger()), autoRehydrate());
    const store = redux.createStore(reducers, INITIAL_STATE, middleware);
    persistStore(store, { blacklist: ['runtime'] });

    let FrameApp = require("./frame/FrameApp").default;
    let container = React.createElement(AppContainer, undefined, React.createElement(FrameApp));
    let provider = React.createElement(Provider, {store: store}, container);
    render(provider, mountPoint);
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
