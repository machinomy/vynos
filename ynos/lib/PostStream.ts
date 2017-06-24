import {Duplex} from "readable-stream";

export type Target = Window | ServiceWorker | null;

function isWindow(target: Target): target is Window {
  return !!((target as Window).window);
}

function isServiceWorker(target: Target): target is ServiceWorker {
  console.log("isServiceWorker", target);
  return target instanceof ServiceWorker;
}

export type PostStreamOptions = {
  name: string,
  target: string,
  targetWindow: Target,
  sourceWindow?: EventTarget,
  origin?: string
}

export default class PostStream extends Duplex {
  sourceName: string;
  targetName: string;
  sourceWindow: EventTarget;
  targetWindow: Target;
  origin: string;

  constructor (options: PostStreamOptions) {
    super({ objectMode: true });

    this.sourceName = options.name;
    this.targetName = options.target;
    this.sourceWindow = options.sourceWindow || window;
    this.targetWindow = options.targetWindow || window;

    this.origin = (options.targetWindow ? '*' : window.location.origin);

    this.sourceWindow.addEventListener('message', this.onMessage.bind(this), false)
  }

  onMessage (event: MessageEvent) {
    let message = event.data;

    let correctOrigin = this.origin === '*' || event.origin === this.origin;
    let correctSource = event.source === this.targetWindow;

    if (correctOrigin && correctSource && typeof message === 'object') {
      if (message.target === this.sourceName && message.data) {
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
      target: this.targetName,
      data: data
    };
    if (isWindow(this.targetWindow)) {
      console.log("iswindow");
      this.targetWindow.postMessage(message, this.origin);
    } else if (isServiceWorker(this.targetWindow)) {
      console.log("isserviceworker");
      this.targetWindow.postMessage(message);
    } else {
      console.log("_write", this.targetWindow);
    }
    next()
  }
}
