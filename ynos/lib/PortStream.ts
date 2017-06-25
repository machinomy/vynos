import {Duplex} from "readable-stream";
import {Buffer} from "buffer";

interface KindaBuffer extends Buffer {
  _isBuffer: boolean
}

function isKindaBuffer(something: any): something is KindaBuffer {
  return Buffer.isBuffer(something);
}

export class PortStream extends Duplex {
  port: MessagePort;

  constructor (port: MessagePort) {
    super({ objectMode: true });

    this.port = port;
    port.onmessage = this.onMessage.bind(this);
  }

  onMessage (message: MessageEvent) {
    let data = message.data;
    if (isKindaBuffer(data)) {
      delete data._isBuffer;
      this.push(Buffer.from(data))
    } else {
      this.push(data)
    }
  }

  _read () {
    // Do Nothing
  }

  _write (message: any, encoding: string, next: (datum?: any) => void) {
    try {
      if (Buffer.isBuffer(message)) {
        let data = Object.assign({_isBuffer: true}, message.toJSON());
        data._isBuffer = true;
        this.port.postMessage(data)
      } else {
        this.port.postMessage(message)
      }
    } catch (error) {
      return next(new Error('PortStream disconnected'))
    }
    next()
  }
}
