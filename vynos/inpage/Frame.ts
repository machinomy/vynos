export default class Frame {
  element: HTMLIFrameElement
  vynosScriptAddress: string

  constructor (scriptAddress: string, frameElement?: HTMLIFrameElement) {
    this.vynosScriptAddress = scriptAddress

    if (frameElement) {
      this.element = frameElement
    } else {
      this.element = document.createElement('iframe')
      this.element.id = 'ynos_frame'
      this.element.style.borderWidth = '0px'
      this.element.style.position = 'fixed'
      this.element.style.top = '0px'
      this.element.style.right = '110px'
      this.element.style.bottom = '0px'
      this.element.style.boxShadow = 'rgba(0, 0, 0, 0.1) 7px 10px 60px 10px'
      this.element.height = '440px'
      this.element.width = '320px'
      this.element.style.marginTop = '-500px';
      this.element.style.opacity = '0'
      this.element.style.transition = 'margin-top 0.7s, opacity 1s'
    }
    this.element.src = this.vynosScriptAddress.replace('vynos.bundle.js', 'frame.html')
    this.element.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin allow-popups allow-forms");
  }

  attach (document: HTMLDocument) {
    if (!this.element.parentElement) {
      document.body.appendChild(this.element);
    }
  }

  display () {
    this.element.style.marginTop = '0px'
    this.element.style.opacity = '1'
  }
}
