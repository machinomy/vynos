export interface ServiceWorkerClient {
  load: (serviceWorker: ServiceWorker) => void
  unload: () => void
}

function activateServiceWorker(client: ServiceWorkerClient, serviceWorker: ServiceWorker) {
  if (serviceWorker.state === 'activated') {
    client.load(serviceWorker)
  }
}

function installServiceWorker(client: ServiceWorkerClient, registration: ServiceWorkerRegistration) {
  registration.onupdatefound = () => {
    registration.update().then(() => {
      registration.unregister().then(() => {
        // Do Nothing
      })
    })
  }

  let serviceWorker = registration.active!

  serviceWorker.onstatechange = () => {
    if (serviceWorker.state === 'redundant') {
      client.unload()
      register(client)
    }
    activateServiceWorker(client, serviceWorker)
  }
  activateServiceWorker(client, serviceWorker)
}

export function register(client: ServiceWorkerClient) {
  if ("serviceWorker" in navigator) {
    let scriptUrl = window.location.href.replace('frame.html', 'worker.bundle.js')
    navigator.serviceWorker.register(scriptUrl, {scope: "./"}).then(registration => {
      installServiceWorker(client, registration)
    }).catch(error => {
      console.error(error)
    })
  } else {
    throw new Error("Browser is not supported")
  }
}
