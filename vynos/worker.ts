import { asServiceWorker } from './worker/window'
import BackgroundController from './worker/controllers/BackgroundController'
import StreamServer from './lib/StreamServer'
import ServiceWorkerStream from './lib/ServiceWorkerStream'
import BackgroundHandler from './worker/controllers/BackgroundHandler'
import NetworkController from './worker/controllers/NetworkController'
import MicropaymentsHandler from './worker/controllers/MicropaymentsHandler'
import MicropaymentsController from './worker/controllers/MicropaymentsController'
import TransactionService from './worker/TransactionService'

asServiceWorker(self => {
  let backgroundController = new BackgroundController()
  let transactionService = new TransactionService(backgroundController.store)
  let networkController = new NetworkController(backgroundController, transactionService)
  let micropaymentsController = new MicropaymentsController(networkController, backgroundController, transactionService)
  let micropaymentsHandler = new MicropaymentsHandler(micropaymentsController)

  let background = new BackgroundHandler(backgroundController)
  let server = new StreamServer('Worker', true)
    .add(background.handler)
    .add(micropaymentsHandler.handler)
    .add(networkController.handler)

  let stream = new ServiceWorkerStream({
    sourceName: 'worker',
    targetName: 'frame',
    source: self
  })
  stream.pipe(server).pipe(stream)
  background.broadcastSharedState(stream)
  background.broadcastBuyProcessEvent(stream)

  self.oninstall = event => {
    event.waitUntil(self.skipWaiting())
  }

  self.onactivate = event => {
    event.waitUntil(self.clients.claim())
  }
})
