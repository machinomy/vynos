export function resource (relativePath: string, baseUrl?: string) {
  const url = new URL(baseUrl || window.location.href)
  let pathname = url.pathname.replace(/\/[\w.]+$/, '/')
  pathname = pathname + relativePath
  pathname = pathname.replace(/\/\//, '/')
  url.pathname = pathname
  return url.toString()
}
