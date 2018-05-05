export function resource (relativePath: string) {
  const url = new URL(process.env.EMBED_ADDRESS || window.location.href)
  let pathname = url.pathname.replace(/\/[\w.]+$/, '/')
  pathname = pathname + relativePath
  pathname = pathname.replace(/\/\//, '/')
  url.pathname = pathname
  return url.toString()
}
