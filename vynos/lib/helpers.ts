const packageJson = require('../../package.json')

export function getVersionPrefix (): string {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return ''
  } else {
    return '/v' + packageJson.version
  }
}

export function isLocalAddress (address: string): boolean {
  const url = new URL(address)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return true
  } else {
    return false
  }
}
