import {Duplex} from "readable-stream";

export type PostStreamOptions = {
  name: string,
  target: string,
  targetWindow?: Window,
  origin?: string
}

export default class WorkerStream extends Duplex {
  name: string;
  target: string;
  targetWindow: Window;
  origin: string;

  constructor (options: PostStreamOptions) {
    super({ objectMode: true });

    this.name = options.name;
    this.target = options.target;
    this.targetWindow = options.targetWindow || window;
    this.origin = (options.targetWindow ? '*' : window.location.origin);

    window.addEventListener('message', this.onMessage.bind(this), false)
  }

  onMessage (event: MessageEvent) {
    let message = event.data;

    let sameOrigin = this.origin === '*' || event.origin === this.origin;
    let sameWindow = event.source === this.targetWindow;

    if (sameOrigin && sameWindow && typeof message === 'object') {
      if (message.target === this.name && message.data) {
        try {
          this.push(message.data)
        } catch (error) {
          this.emit('error', error)
        }
      }
    }
  }

  _read () {
    // Do Nothing
  }

  _write (data: any, encoding: string, next: () => void) {
    let message = {
      target: this.target,
      data: data
    };
    this.targetWindow.postMessage(message, this.origin);
    next()
  }
}
