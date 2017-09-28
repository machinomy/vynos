import {DevWindow, VynosWindow} from './window'
import VynosNamespace from './inpage/VynosImpl'

let global = window as DevWindow & VynosWindow

let isVynosPresent = global.vynos && global.vynos instanceof VynosNamespace;
if (!isVynosPresent) {
  global.vynos = new VynosNamespace(document.currentScript as HTMLScriptElement)
}
