export function embed (scriptElement?: HTMLScriptElement | any): string {
  if (scriptElement instanceof HTMLScriptElement) {
    return scriptElement.src
  } else {
    return process.env.EMBED_ADDRESS || ''
  }
}

export function frameHtml (baseAddress: string): string {
  return baseAddress.replace(/vynos.js/, 'frame.html')
}
