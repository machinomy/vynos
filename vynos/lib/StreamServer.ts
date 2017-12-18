import {Duplex} from "readable-stream";
import {RequestPayload, ResponsePayload, Payload} from "./Payload";
import _ = require("lodash")

export type EndFunction = <A extends Payload>(error: null, response?: A) => void;
export type Handler = (message: Payload, next: Function, end: EndFunction) => void;

export default class StreamServer extends Duplex {
  _handlers: Array<Handler>
  verbose: boolean
  name: string

  constructor(name?: string, verbose: boolean = false) {
    super({objectMode: true})
    this._handlers = [];
    this.name = `StreamServer at ${name}` || "StreamServer";
    this.verbose = verbose;
  }

  add(handler: Handler): this {
    this._handlers.push(handler);
    return this;
  }

  handle<A extends Payload>(payload: A) {
    const end = <A extends Payload>(error: null, response?: A) => {
      if (error) {
        console.error(error)
        this.push({
          id: payload.id,
          jsonrpc: payload.jsonrpc,
          error: (error || '').toString()
        })
      } else {
        if (response) this.push(response)
      }
    }

    const nextHandler = (handlers: Array<Handler>) => {
      let head = _.head(handlers)
      let next = () => nextHandler(_.tail(handlers))
      if (head) {
        head(payload, next, end)
      } else {
        if (this.verbose) console.log(`${this.name}: No response for message`, payload)
      }
    }

    nextHandler(this._handlers)
  }

  _read(n: number) {
    // Do Nothing
  }

  _write<A extends RequestPayload>(payload: A, encoding: string, next: Function) {
    this.handle(payload)
    next()
  }
}
