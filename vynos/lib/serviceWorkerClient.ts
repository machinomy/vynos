import { BROWSER_NOT_SUPPORTED_TEXT } from '../frame/constants'

export interface ServiceWorkerClient {
  load: (serviceWorker: ServiceWorker) => void
  unload: () => void
}

function activate(client: ServiceWorkerClient, serviceWorker: ServiceWorker) {
  if (serviceWorker.state === 'activated') {
    client.load(serviceWorker)
  }
}

function install(client: ServiceWorkerClient, registration: ServiceWorkerRegistration) {
  registration.onupdatefound = () => {
    registration.update().then(() => {
      registration.unregister().then(() => {
        // Do Nothing
      })
    })
  }

  let serviceWorker = (registration.active || registration.installing)!;

  serviceWorker.onstatechange = () => {
    if (serviceWorker.state === 'redundant') {
      client.unload()
      register(client)
    }
    activate(client, serviceWorker)
  }

  activate(client, serviceWorker)
}

export function register(client: ServiceWorkerClient) {
  if ("serviceWorker" in navigator) {
    const workerSrc = 'worker.js'
    const src = window.location.href.match(/dev=true/) ? workerSrc.replace('.js', '.dev.js') : workerSrc;
    const scriptUrl = window.location.href.replace('frame.html', src)
    navigator.serviceWorker.register(scriptUrl, {scope: "./"}).then(registration => {
      install(client, registration)
    }).catch(error => {
      console.error(error)
    })
  } else {
    throw new Error(BROWSER_NOT_SUPPORTED_TEXT)
  }
}
