export default class Frame {
  frameElement: HTMLIFrameElement
  scriptElement: HTMLScriptElement

  constructor (script: HTMLScriptElement, frameElement?: HTMLIFrameElement) {
    this.scriptElement = script

    if (frameElement) {
      this.frameElement = frameElement
    } else {
      this.frameElement = document.createElement('iframe');
      this.frameElement.id = 'ynos_frame';
      this.frameElement.style.borderWidth = '0px';
      this.frameElement.style.position = 'fixed';
      this.frameElement.style.top = '0px';
      this.frameElement.style.right = '110px';
      this.frameElement.style.bottom = '0px';
      this.frameElement.style.boxShadow = 'rgba(0, 0, 0, 0.1) 7px 10px 60px 10px';
      this.frameElement.height = '440px';
      this.frameElement.width = '320px';
      //frame.style.marginRight = '-320px';
    }
  }

  build (): HTMLIFrameElement {
    let currentScriptAddress = this.scriptElement.src
    this.frameElement.src = currentScriptAddress.replace('vynos.bundle.js', 'frame.html')
    this.frameElement.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin allow-popups allow-forms");
    return this.frameElement;
  }
}
