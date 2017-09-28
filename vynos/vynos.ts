import {DevWindow, VynosWindow} from './window'
import Namespace from './inpage/Namespace'

let global = window as DevWindow & VynosWindow

let isVynosPresent = global.vynos && global.vynos instanceof Namespace
if (!isVynosPresent) {
  global.vynos = new Namespace(document.currentScript as HTMLScriptElement, window)
}
