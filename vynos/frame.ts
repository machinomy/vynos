import { register } from './lib/serviceWorkerClient'
import Client from './frame/Client'

window.addEventListener('load', () => {
  let client = new Client()
  register(window, client)
})
