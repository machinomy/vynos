import {asServiceWorker} from './worker/window'
import BackgroundController from "./worker/BackgroundController";
import StreamServer, {Handler} from "./lib/StreamServer";
import ServiceWorkerStream from "./lib/ServiceWorkerStream";
import {AccountsRequest} from "./lib/rpc/eth";

asServiceWorker(self => {
  const ethAccountsHandler: Handler = (message: AccountsRequest, next, end) => {
    console.log("ethAccountsHandler", message)
    if (message.method === "eth_accounts") {
      end(null, {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: ["0xdeadbeaf"]
      })
    } else {
      next();
    }
  }

  let backgroundController = new BackgroundController();

  let server = new StreamServer(true)
  server.add(ethAccountsHandler)

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
