const packageJson = require('../../package.json')

function getVersionPrefix (baseUrl: string): string {
  if (baseUrl === '') {
    baseUrl = window.location.href
  }
  const url = new URL(baseUrl)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return ''
  } else {
    return '/v' + packageJson.version
  }
}

export function resource (pathToResource: string, baseUrl?: string) {
  if (baseUrl === undefined) {
    baseUrl = ''
  }
  return baseUrl + getVersionPrefix(baseUrl) + pathToResource
}
