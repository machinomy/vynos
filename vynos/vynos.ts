import {DevWindow, VynosWindow} from './window'
import Namespace from './inpage/Namespace'

let global = window as DevWindow & VynosWindow

let isVynosPresent = global.vynos && global.vynos instanceof Namespace
if (!isVynosPresent) {
  global.vynos = new Namespace(document.currentScript as HTMLScriptElement, window)
}
if (!("serviceWorker" in navigator)) {
  let b = document.createElement('div');
  b.innerHTML = "Browser is not supported, please update your browser. " +
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
  b.addEventListener('click', () => {
    b.remove();
  });
  document.getElementsByTagName('body')[0].appendChild(b);
  throw Error('Browser is not supported, please update your browser.');
}
