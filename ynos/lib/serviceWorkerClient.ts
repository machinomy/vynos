export function initServiceWorkerClient(main: (sw: ServiceWorker, onUnload: Function) => void) {
  let _unload: Function|null = null;

  const isServiceWorker = (s: any): s is ServiceWorker => true
  const extractServiceWorker = (r: ServiceWorkerRegistration, fn: (sw: ServiceWorker) => void) => {
    let serviceWorker = r.active || r.installing || r.waiting;
    if (serviceWorker) {
      fn(serviceWorker)
    }
  };
  const freshInstall = (sw: ServiceWorker, r: ServiceWorkerRegistration) => {
    const statechange = (e: Event) => {
      if (isServiceWorker(e.target)) {
        if (e.target.state === "activated") {
          main(e.target, (fn: Function) => { _unload = fn });
          sw.removeEventListener("statechange", statechange)
        }

        if (e.target.state === "redundant" && _unload) {
          _unload();
          r.unregister().then(result => {
            initServiceWorkerClient(main)
          })
        }
      }
    };
    sw.addEventListener("statechange", statechange)
  };

  if ("serviceWorker" in navigator) {
    let scriptUrl = window.location.href.replace('frame.html', 'worker.bundle.js');
    navigator.serviceWorker.register(scriptUrl, {scope: "./"}).then(registration => {
      registration.onupdatefound = () => {
        extractServiceWorker(registration, sw => {
          freshInstall(sw, registration)
        })
      }
      extractServiceWorker(registration, sw => {
        freshInstall(sw, registration)
        main(sw, (fn: Function) => { _unload = fn })
      })
    }).catch(error => {
      console.error(error)
    })
  } else {
    throw new Error("ERROR FIXME SW: Browser is not supported")
  }
}
