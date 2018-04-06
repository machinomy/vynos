import * as React from 'react';
import * as url from 'url'
import Namespace from './inpage/Namespace'

const HOST = 'https://vynos.tech'

export function scriptTag (version?: string, host?: string) {
  let _host = host || HOST
  let fileName = version ? `vynos_${version}.js` : 'vynos.js'
  let src = url.resolve(_host, fileName)
  return <script src={src}/>
}

declare global {
  interface Window {
    vynos: Namespace
  }
}

