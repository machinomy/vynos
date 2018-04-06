import * as url from 'url'
import Namespace from './inpage/Namespace'

const HOST = 'https://vynos.tech'

export function scriptTag(version?: string, host?: string): HTMLScriptElement {
  let scriptElement = new HTMLScriptElement()
  let _host = host || HOST
  let fileName = version ? `vynos_${version}.js` : 'vynos.js'
  scriptElement.src = url.resolve(_host, fileName)
  scriptElement.async = true
  return scriptElement
}

declare global {
  interface Window {
    vynos: Namespace
  }
}
