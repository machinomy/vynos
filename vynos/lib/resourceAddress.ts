export function embed(scriptElement?: HTMLScriptElement | any): string {
  if (scriptElement instanceof HTMLScriptElement) {
    return scriptElement.src
  } else {
    console.log(process.env)
    return process.env.EMBED_ADDRESS || ''
  }
}
