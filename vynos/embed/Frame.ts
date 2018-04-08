import * as resourceAddress from '../lib/resourceAddress'

const FRAME_HEIGHT = 440
const FRAME_WIDTH = 320
const CLOSE_HEIGHT = 40
const CLOSE_WIDTH = 130

// const imgUpArrow = require('../frame/styles/images/up-arrow.svg') FIXME Prevents TS compilation

function containerElement (document: HTMLDocument) {
  let element = document.createElement('div')
  element.id = Frame.CONTAINER_ID
  element.style.position = 'fixed'
  element.style.top = '0px'
  element.style.right = '110px'
  element.style.height = (FRAME_HEIGHT + CLOSE_HEIGHT) + 'px'
  element.style.width = FRAME_WIDTH + 'px'
  element.style.zIndex = '9999999'
  element.style.transition = 'margin-top 0.7s'
  return element
}

function frameElement (document: HTMLDocument): HTMLIFrameElement {
  let element = document.createElement('iframe')
  element.style.borderWidth = '0px'
  element.height = FRAME_HEIGHT + 'px'
  element.width = FRAME_WIDTH + 'px'
  element.style.boxShadow = 'rgba(0, 0, 0, 0.1) 7px 10px 60px 10px'
  return element
}

function closeElement(document: HTMLDocument) {
 let element = document.createElement('div')
  element.id = 'vynos_frame_close_button'
  // let srcCloseButton = this.vynosScriptAddress.replace(/vynos(.|.dev.)js/, imgUpArrow) FIXME Prevents TS compilation
  // _frameElement.innerHTML = '<img id="vynos_frame_img_close_button" src="' + srcCloseButton + '">' FIXME Prevents TS compilation
  element.style.height = (FRAME_HEIGHT + CLOSE_HEIGHT) + 'px'
  element.style.cursor = 'pointer'
  element.style.width = CLOSE_WIDTH + '%'
  element.style.margin = '-' + FRAME_HEIGHT + 'px 0 0 -' + ((CLOSE_WIDTH - 100) / 2) + '%'
  element.setAttribute('title', 'Hide Vynos')
  element.appendChild(document.createTextNode(''))
  return element
}

export default class Frame {
  private _frameElement?: HTMLIFrameElement
  private _containerElement?: HTMLDivElement
  vynosScriptAddress: string

  static CONTAINER_ID = 'machinomy-wallet-frame-container'

  constructor (baseAddress: string) {
    this.vynosScriptAddress = baseAddress
  }

  async element (): Promise<HTMLIFrameElement> {
    if (!this._frameElement) {
      this._frameElement = frameElement(document)
      this._frameElement.style.transition = 'opacity 1s'
      this._frameElement.src = resourceAddress.frameHtml(this.vynosScriptAddress)
      this._frameElement.setAttribute('sandbox', 'allow-scripts allow-modals allow-same-origin allow-popups allow-forms')
    }

    return this._frameElement
  }

  async containerElement (): Promise<HTMLDivElement> {
    console.log(resourceAddress.frameHtml(this.vynosScriptAddress))
    if (!this._containerElement) {
      this._containerElement = containerElement(document)

      let frameElement = await this.element()
      this._containerElement.appendChild(frameElement)

      let closeButton = closeElement(document)
      closeButton.addEventListener('click', async () => {
        await this.hide()
      })
      this._containerElement.appendChild(closeButton)

      const style = '#vynos_frame_img_close_button{width: 40px;bottom: 3px;position: absolute;left: 50%;margin-left: -20px;opacity:0;transition: opacity 1s}' +
        '#vynos_frame_close_button:hover > #vynos_frame_img_close_button{opacity: 1}'
      let styleElement = document.createElement('style')
      styleElement.appendChild(document.createTextNode(style))
      this._containerElement.appendChild(styleElement)

      let notifications = document.createElement('div')
      notifications.id = 'vynos_notifications'
      notifications.style.marginTop = '25px'
      this._containerElement.appendChild(notifications)
    }

    return this._containerElement
  }

  async attach (document: HTMLDocument): Promise<void> {
    await this.hide()
    let containerElement = await this.containerElement()
    let frameElement = await this.element()
    if (containerElement && !containerElement.parentElement) {
      document.body.insertBefore(containerElement, document.body.firstChild)
    } else if (!frameElement.parentElement) {
      document.body.insertBefore(containerElement, document.body.firstChild)
    }
  }

  async display (): Promise<void> {
    let containerElement = await this.containerElement()
    let frameElement = await this.element()

    containerElement.style.marginTop = '0px'
    frameElement.style.opacity = '1'
  }

  async hide (): Promise<void> {
    let containerElement = await this.containerElement()
    let frameElement = await this.element()

    containerElement.style.marginTop = '-500px'
    frameElement.style.opacity = '0'
  }
}
