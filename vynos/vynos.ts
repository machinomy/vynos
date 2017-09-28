import {DevWindow, VynosWindow} from "./YnosWindow";
import VynosImpl from './inpage/VynosImpl'

let _window = (<DevWindow & VynosWindow>window);

let ynosPresent = _window.vynos && _window.vynos instanceof VynosImpl;
if (!ynosPresent) {
  _window.vynos = new VynosImpl(document.currentScript as HTMLScriptElement)
}
