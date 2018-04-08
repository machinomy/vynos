import UpgradeBanner from './UpgradeBanner'
import { BROWSER_NOT_SUPPORTED_TEXT } from '../frame/constants'

export class UnsupportedBrowserError extends Error {}

export default class BrowserSupport {
  private _isSupported?: boolean
  private banner: UpgradeBanner

  constructor (window: Window) {
    this.banner = new UpgradeBanner(window)
  }

  assertServiceWorker (): boolean {
    return ('serviceWorker' in navigator)
  }

  isSupported () {
    if (typeof this._isSupported === 'undefined') {
      this._isSupported = this.assertServiceWorker()
    }
    return this._isSupported
  }

  async assert (): Promise<boolean> {
    if (this.isSupported()) {
      return Promise.resolve(true)
    } else {
      this.banner.render()
      throw new UnsupportedBrowserError(BROWSER_NOT_SUPPORTED_TEXT)
    }
  }
}
