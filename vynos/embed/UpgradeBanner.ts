const ID = 'machinomy-wallet-upgrade-banner'

export default class UpgradeBanner {
  window: Window

  constructor (window: Window) {
    this.window = window
  }

  isDisplayed (): boolean {
    return this.window.document.getElementById(ID) !== null
  }

  render (): void {
    if (this.isDisplayed()) return

    let banner = this.window.document.createElement('div')
    banner.id = ID
    // b.innerHTML = BROWSER_NOT_SUPPORTED_TEXT +
    //   '<img src="' + global.vynos.scriptAddress.replace(/vynos(.|.dev.)js/, require('./frame/styles/images/close-button.svg')) + '" ' +
    //   'style="position: fixed;right: 20px;top: 13px;width: 17px;">' FIXME Prevents TS compilation
    banner.style.position = 'fixed'
    banner.style.width = '100%'
    banner.style.height = '45px'
    banner.style.backgroundColor = '#ff380e'
    banner.style.color = '#fff'
    banner.style.textAlign = 'center'
    banner.style.top = '0'
    banner.style.lineHeight = '45px'
    banner.style.fontSize = '18px'
    banner.style.cursor = 'pointer'
    banner.style.zIndex = '9999999'
    banner.addEventListener('click', () => {
      banner.remove()
    })

    this.window.addEventListener('load', () => {
      let body = this.window.document.body
      body.appendChild(banner)
    })
  }
}
