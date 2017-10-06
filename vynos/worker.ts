import {asServiceWorker} from './worker/window'
import BackgroundController from "./worker/controllers/BackgroundController";
import StreamServer from "./lib/StreamServer";
import ServiceWorkerStream from "./lib/ServiceWorkerStream";
import BackgroundHandler from "./worker/controllers/BackgroundHandler";
import NetworkController from "./worker/controllers/NetworkController";
import MicropaymentsHandler from "./worker/controllers/MicropaymentsHandler";
import MicropaymentsController from "./worker/controllers/MicropaymentsController";
import _ = require('lodash')
import {DevWindow} from "./window";

asServiceWorker(self => {
  let backgroundController = new BackgroundController()
  let rpcUrl: null | string = null
  if (self.registration.active) {
    let scriptUrl = self.registration.active.scriptURL
    let scriptQuery = scriptUrl.replace(/.*\?/, '')
    let query = _.chain(scriptQuery).replace('?', '').split('&').map(_.ary(_.partial(_.split, _, '='), 1)).fromPairs().value()
    rpcUrl = query.rpc_url
  }
  rpcUrl = rpcUrl || (window as DevWindow).RPC_URL || 'https://ropsten.infura.io/T1S8a0bkyrGD7jxJBgeH';
  let networkController = new NetworkController(backgroundController, rpcUrl)

  let micropaymentsController = new MicropaymentsController(networkController, backgroundController)
  let micropaymentsHandler = new MicropaymentsHandler(micropaymentsController)

  let background = new BackgroundHandler(backgroundController)
  let server = new StreamServer("Worker", true)
    .add(background.handler)
    .add(micropaymentsHandler.handler)
    .add(networkController.handler)

  let stream = new ServiceWorkerStream({
    sourceName: "worker",
    targetName: "frame",
    source: self
  });
  stream.pipe(server).pipe(stream)
  background.broadcastSharedState(stream)

  self.oninstall = event => {
    event.waitUntil(self.skipWaiting())
  }

  self.onactivate = event => {
    event.waitUntil(self.clients.claim())
  }
})
