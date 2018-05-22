import Wallet from './embed/Wallet'
import * as html2canvas from 'html2canvas'
import Setup from './embed/Setup'
import IWalletWindow from './lib/IWalletWindow'
import MockingIWalletWindow from '../harness/lib/MockingIWalletWindow'
import MockingWallet from '../harness/embed/MockingWallet'
import MockingSetup from '../harness/embed/MockingSetup'
import * as resourceAddress from './lib/resourceAddress'

let w = window as IWalletWindow
if (!w.vynos) {
  let setup = new Setup(document.currentScript, window)
  w.vynos = new Wallet(setup.client(), setup.frame())
}

let setupMocking = new MockingSetup(resourceAddress.embed(), window)
let walletMocking = new MockingWallet(setupMocking.client(), setupMocking.frame())
let mockingW = window as MockingIWalletWindow
if (mockingW && !mockingW.mockingVynos) {
  mockingW.mockingVynos = walletMocking
}

if (!document.querySelectorAll('meta[property=\'og:image\']').length && document.body) {
  let size = document.body.clientHeight
  html2canvas(document.body, {
    width: size,
    height: size,
    logging: false
  }).then(canvas => {
    let metaImageNode = document.createElement('meta')
    metaImageNode.setAttribute('property', 'og:image')
    metaImageNode.setAttribute('content', canvas.toDataURL())
    document.body.appendChild(metaImageNode)
  })
}

w.showVynosNotification = function (text: string, time?: number) {
  let vynosNotifications = document.getElementById('vynos_notifications')
  if (!vynosNotifications) {
    return
  }
  let id = 'vynos_notifications_id:' + Date.now()
  let notification = document.createElement('div')
  notification.id = id
  notification.innerHTML = text
  notification.style.cursor = 'pointer'
  notification.style.background = '#fff'
  notification.style.border = '1px solid #f00'
  notification.style.backgroundColor = '#fff'
  notification.style.padding = '10px'
  notification.style.margin = '10px 0'
  notification.style.zIndex = '9999999'
  notification.addEventListener('click', () => {
    notification.remove()
  })
  vynosNotifications.appendChild(notification);
  (function (id, _time) {
    setTimeout(function () {
      let notification = document.getElementById(id)
      if (notification) {
        notification.remove()
      }
    }, _time * 1000)
  })(id, time || 3)
}
