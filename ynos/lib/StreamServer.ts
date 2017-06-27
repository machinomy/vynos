import {Duplex} from "readable-stream";
import Payload from "./Payload";
import Response from "./Response";
import _ from "lodash";

export type ErrorEndFunction = (error: Error, response: null) => void;
export type ResponseEndFunction = (error: null, response: Response) => void;
export type EndFunction = ErrorEndFunction|ResponseEndFunction;
export type Handler = (message: Payload, next: Function, end: EndFunction) => void;

const dummy: Handler = (message, next, end: ErrorEndFunction) => {
  end(new Error(`No response for message, ${message}`), null)
}

export default class StreamServer extends Duplex {
  _handlers: Array<Handler>

  constructor() {
    super({objectMode: true})
    this._handlers = [];
  }

  add(handler: Handler): this {
    this._handlers.unshift(handler);
    return this;
  }

  handle<A extends Payload>(payload: A): Promise<Response> {
    return new Promise((resolve, reject) => {
      function end(error: any, response: Response) {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      }

      function nextHandler(handlers: Array<Handler>) {
        let head = _.head(handlers)
        let next = () => nextHandler(_.tail(handlers))
        if (head) {
          head(payload, next, end)
        } else {
          dummy(payload, next, end)
        }
      }

      nextHandler(this._handlers)
    })
  }

  _read(n: number) {
    // Do Nothing
  }

  _write<A extends Payload>(payload: A, encoding: string, next: Function) {
    this.handle(payload).then(response => {
      this.push(response)
    }).catch(error => {
      console.error(error)
    })
    next()
  }
}
