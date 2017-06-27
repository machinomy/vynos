import {asServiceWorker} from './worker/window'
import BackgroundController from "./worker/BackgroundController";
import StreamServer, {Handler, ResponseEndFunction} from "./lib/StreamServer";
import ServiceWorkerStream from "./lib/ServiceWorkerStream";

asServiceWorker(self => {
  const helloHandler: Handler = (message, next, end: ResponseEndFunction) => {
    console.log("Hello handler got", message)
    end(null, {
      id: message.id,
      jsonrpc: message.jsonrpc,
      result: "world!"
    })
  }

  let backgroundController = new BackgroundController();

  let server = new StreamServer();
  server.add(helloHandler);

  let stream = new ServiceWorkerStream(self);
  stream.pipe(server).pipe(stream);

  self.oninstall = event => {
    event.waitUntil(self.skipWaiting())
  }

  self.onactivate = event => {
    event.waitUntil(self.clients.claim())
  }
})
