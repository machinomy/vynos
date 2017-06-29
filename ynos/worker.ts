import {asServiceWorker} from './worker/window'
import BackgroundController from "./worker/BackgroundController";
import StreamServer, {Handler} from "./lib/StreamServer";
import ServiceWorkerStream from "./lib/ServiceWorkerStream";

asServiceWorker(self => {
  const helloHandler: Handler = (message, next, end) => {
    end(null, {
      id: message.id,
      jsonrpc: message.jsonrpc,
      result: "Hi from worker!"
    })
  }

  let backgroundController = new BackgroundController();

  let server = new StreamServer()
  server.add(helloHandler)

  let stream = new ServiceWorkerStream({
    sourceName: "worker",
    targetName: "frame",
    source: self
  });
  stream.pipe(server).pipe(stream);

  self.oninstall = event => {
    event.waitUntil(self.skipWaiting())
  }

  self.onactivate = event => {
    event.waitUntil(self.clients.claim())
  }
})
