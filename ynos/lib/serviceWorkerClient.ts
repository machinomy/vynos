export function initServiceWorkerClient(main: (sw: ServiceWorker) => void) {
  const isServiceWorker = (s: any): s is ServiceWorker => true
  const extractServiceWorker = (r: ServiceWorkerRegistration, fn: (sw: ServiceWorker) => void) => {
    let serviceWorker = r.active || r.installing || r.waiting;
    if (serviceWorker) {
      fn(serviceWorker)
    }
  }
  const freshInstall = (sw: ServiceWorker) => {
    const statechange = (e: Event) => {
      console.log(e)
      if (isServiceWorker(e.target)) {
        console.log(e.target)
        console.log(e.target.state)
        if (e.target.state === "activated") {
          main(e.target)
          sw.removeEventListener("statechange", statechange)
        }
      }
    }
    sw.addEventListener("statechange", statechange)
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("worker.bundle.js", {scope: "./"}).then(registration => {
      registration.onupdatefound = () => {
        console.log("onupdatefound")
        extractServiceWorker(registration, sw => {
          freshInstall(sw)
        })
      }
      extractServiceWorker(registration, sw => {
        freshInstall(sw)
        main(sw)
      })
    }).catch(error => {
      console.log("ERROR", error)
    })
  } else {
    console.log("ERROR FIXME SW: Browser is not supported");
  }
}
