const FRAME_HEIGHT = 440
const FRAME_WIDTH = 320
const CLOSE_HEIGHT = 40

export default class Frame {
  element: HTMLIFrameElement
  containerElement: HTMLDivElement
  closeButton: HTMLDivElement
  vynosScriptAddress: string

  constructor (scriptAddress: string, frameElement?: HTMLIFrameElement) {
    this.vynosScriptAddress = scriptAddress

    if (frameElement) {
      this.element = frameElement
    } else {
      this.containerElement = document.createElement('div')
      this.element = document.createElement('iframe')
      this.element.id = 'ynos_frame'
      this.element.style.borderWidth = '0px'
      this.element.height = FRAME_HEIGHT + 'px'
      this.element.width = FRAME_WIDTH + 'px'
      this.element.style.boxShadow = 'rgba(0, 0, 0, 0.1) 7px 10px 60px 10px'

      this.closeButton = document.createElement('div')
      this.closeButton.style.height = CLOSE_HEIGHT + 'px'
      this.closeButton.style.cursor = 'pointer'
      this.closeButton.setAttribute('title', 'Hide Vynos')
      this.closeButton.appendChild(document.createTextNode(''))
      this.closeButton.addEventListener('click', () => {
        this.hide()
      })

      this.containerElement.appendChild(this.element)
      this.containerElement.appendChild(this.closeButton)

      this.containerElement.style.position = 'fixed'
      this.containerElement.style.top = '0px'
      this.containerElement.style.right = '110px'
      this.containerElement.style.height = (FRAME_HEIGHT + CLOSE_HEIGHT).toString() + 'px'
      this.containerElement.style.width = FRAME_WIDTH + 'px'

      this.hide()

      this.containerElement.style.transition = 'margin-top 0.7s, opacity 1s'
    }
    this.element.src = this.vynosScriptAddress.replace('vynos.bundle.js', 'frame.html')
    this.element.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin allow-popups allow-forms");
  }

  attach (document: HTMLDocument) {
    if (this.containerElement && !this.containerElement.parentElement) {
      document.body.appendChild(this.containerElement);
    } else if (!this.element.parentElement) {
      document.body.appendChild(this.element);
    }
  }

  display () {
    this.containerElement.style.marginTop = '0px'
    this.containerElement.style.opacity = '1'
  }

  hide () {
    this.containerElement.style.marginTop = '-500px';
    this.containerElement.style.opacity = '0'
  }
}
