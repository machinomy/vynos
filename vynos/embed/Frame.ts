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
  // element.innerHTML = '<img id="vynos_frame_img_close_button" src="' + srcCloseButton + '">' FIXME Prevents TS compilation
  element.style.height = (FRAME_HEIGHT + CLOSE_HEIGHT) + 'px'
  element.style.cursor = 'pointer'
  element.style.width = CLOSE_WIDTH + '%'
  element.style.margin = '-' + FRAME_HEIGHT + 'px 0 0 -' + ((CLOSE_WIDTH - 100) / 2) + '%'
  element.setAttribute('title', 'Hide Vynos')
  element.appendChild(document.createTextNode(''))
  return element
}

export default class Frame {
  element: HTMLIFrameElement
  container: HTMLDivElement
  closeButton: HTMLDivElement
  style: HTMLStyleElement
  vynosScriptAddress: string
  notifications: HTMLDivElement

  static CONTAINER_ID = 'machinomy-wallet-frame-container'

  constructor (baseAddress: string) {
    this.vynosScriptAddress = baseAddress
    // let srcCloseButton = this.vynosScriptAddress.replace(/vynos(.|.dev.)js/, imgUpArrow) FIXME Prevents TS compilation
    this.container = containerElement(document)
    this.element = frameElement(document)
    this.closeButton = closeElement(document)
    this.closeButton.addEventListener('click', () => {
      this.hide()
    })

    const style = '#vynos_frame_img_close_button{width: 40px;bottom: 3px;position: absolute;left: 50%;margin-left: -20px;opacity:0;transition: opacity 1s}' +
      '#vynos_frame_close_button:hover > #vynos_frame_img_close_button{opacity: 1}'
    this.style = document.createElement('style')
    this.style.appendChild(document.createTextNode(style))

    this.notifications = document.createElement('div')
    this.notifications.id = 'vynos_notifications'
    this.notifications.style.marginTop = '25px'

    this.container.appendChild(this.element)
    this.container.appendChild(this.closeButton)
    this.container.appendChild(this.style)
    this.container.appendChild(this.notifications)

    this.hide()

    this.element.style.transition = 'opacity 1s'
    this.element.src = resourceAddress.frameHtml(this.vynosScriptAddress)
    this.element.setAttribute('sandbox', 'allow-scripts allow-modals allow-same-origin allow-popups allow-forms')
  }

  attach (document: HTMLDocument) {
    if (this.container && !this.container.parentElement) {
      document.body.insertBefore(this.container, document.body.firstChild)
    } else if (!this.element.parentElement) {
      document.body.insertBefore(this.container!, document.body.firstChild)
    }
  }

  display () {
    this.container.style.marginTop = '0px'
    this.element.style.opacity = '1'
  }

  hide () {
    this.container.style.marginTop = '-500px'
    this.element.style.opacity = '0'
  }
}
