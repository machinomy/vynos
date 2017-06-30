import {asServiceWorker} from './worker/window'
import BackgroundController from "./worker/BackgroundController";
import StreamServer from "./lib/StreamServer";
import ServiceWorkerStream from "./lib/ServiceWorkerStream";
import BackgroundHandler from "./lib/BackgroundHandler";

asServiceWorker(self => {
  let backgroundController = new BackgroundController()
  let background = new BackgroundHandler(backgroundController)
  let server = new StreamServer("Worker", true)
  server.add(background.handler)

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
