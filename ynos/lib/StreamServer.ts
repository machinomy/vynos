import {Duplex} from "readable-stream";
import {RequestPayload, Response, Payload} from "./Payload";
import _ from "lodash";

export type EndFunction = <A extends Payload>(error: null, response?: A) => void;
export type Handler = (message: Payload, next: Function, end: EndFunction) => void;

export default class StreamServer extends Duplex {
  _handlers: Array<Handler>
  verbose: boolean

  constructor(verbose: boolean = false) {
    super({objectMode: true})
    this._handlers = [];
    this.verbose = verbose
  }

  add(handler: Handler): this {
    this._handlers.push(handler);
    return this;
  }

  handle<A extends Payload>(payload: A): Promise<Payload> {
    return new Promise((resolve, reject) => {
      const end = <A extends Payload>(error: null, response?: A) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      }

      const nextHandler = (handlers: Array<Handler>) => {
        let head = _.head(handlers)
        let next = () => nextHandler(_.tail(handlers))
        if (head) {
          head(payload, next, end)
        } else {
          if (this.verbose) console.log("No response for message", payload)
          end(null, payload)
        }
      }

      nextHandler(this._handlers)
    })
  }

  _read(n: number) {
    // Do Nothing
  }

  _write<A extends RequestPayload>(payload: A, encoding: string, next: Function) {
    this.handle(payload).then(response => {
      if (response) this.push(response)
    }).catch(error => {
      console.error(error)
    })
    next()
  }
}
