import { DevWindow, VynosWindow } from './window'
import Namespace from './inpage/Namespace'
import { BROWSER_NOT_SUPPORTED_TEXT } from './frame/constants'
import * as html2canvas from 'html2canvas'

let global = window as DevWindow & VynosWindow

let isVynosPresent = global.vynos && global.vynos instanceof Namespace
if (!isVynosPresent) {
  global.vynos = new Namespace(document.currentScript as HTMLScriptElement, window)
}

if (!document.querySelectorAll('meta[property="og:image"]').length) {
  html2canvas(document.body, {
    width: document.body.clientHeight,
    height: document.body.clientHeight,
    logging: false
  }).then(canvas => {
    let metaImageNode = document.createElement('meta')
    metaImageNode.setAttribute('property', 'og:image')
    metaImageNode.setAttribute('content', canvas.toDataURL())
    document.body.appendChild(metaImageNode)
  })
}

if (!("serviceWorker" in navigator)) {
  let b = document.createElement('div');
  b.innerHTML = BROWSER_NOT_SUPPORTED_TEXT +
    "<img src='" + global.vynos.scriptAddress.replace(/vynos(.|.dev.)js/, require('./frame/styles/images/close-button.svg')) + "' " +
    "style='position: fixed;right:20px;top: 13px;;width: 17px'>";
  b.style.position = 'fixed';
  b.style.width = '100%';
  b.style.height = '45px';
  b.style.backgroundColor = '#ff380e';
  b.style.color = '#fff';
  b.style.textAlign = 'center';
  b.style.top = '0';
  b.style.lineHeight = '45px';
  b.style.fontSize = '18px';
  b.style.cursor = 'pointer';
  b.style.zIndex = '9999999';
  b.addEventListener('click', () => {
    b.remove();
  });
  document.getElementsByTagName('body')[0].appendChild(b);
  throw Error(BROWSER_NOT_SUPPORTED_TEXT);
}

global.showVynosNotification = function(text: string, time?: number) {
  let vynos_notifications = document.getElementById('vynos_notifications');
  if(!vynos_notifications) return;
  let id = 'vynos_notifications_id:' + Date.now();
  let notification = document.createElement('div');
  notification.id = id;
  notification.innerHTML = text;
  notification.style.cursor = 'pointer';
  notification.style.background = '#fff';
  notification.style.border = '1px solid #f00';
  notification.style.backgroundColor = '#fff';
  notification.style.padding = '10px';
  notification.style.margin = '10px 0';
  notification.style.zIndex = '9999999';
  notification.addEventListener('click', () => {
    notification.remove();
  });
  vynos_notifications.appendChild(notification);
  (function (id, _time) {
    setTimeout(function () {
      let notification = document.getElementById(id);
      if(notification) notification.remove();
    }, _time * 1000);
  })(id, time || 3);
}
