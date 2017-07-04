import {Duplex} from "readable-stream";
import Payload, {ResponsePayload} from "./Payload";

export default class StreamProvider extends Duplex {
  _callbacks: Map<string, Function>
  name: string
  strict: boolean

  constructor(name?: string, strict?: boolean) {
    super({objectMode: true})
    this._callbacks = new Map()
    this.name = `StreamProvider at ${name}` || "StreamProvider"
    this.strict = strict || false
  }

  sendAsync<A extends Payload, B>(payload: A, callback: Function) {
    this.ask(payload).then(result => {
      callback(null, result)
    }).catch(error => {
      callback(error, null)
    })
  }

  ask<A extends Payload, B>(payload: A, timeout: number = 0): Promise<B> {
    let id = payload.id
    let result = new Promise<B>((resolve, reject) => {
      let resolved = false

      this._callbacks.set(id.toString(), (response: B) => {
        resolved = true
        resolve(response)
      })

      if (timeout > 0) {
        setTimeout(() => {
          if (!resolved) reject(new Error("Timeout"))
        }, timeout)
      }
    })
    this.push(payload)
    return result
  }

  listen<B>(id: string, handler: (response: B) => void) {
    this._callbacks.set(id, handler)
  }

  _read(n: number) {
    // Do Nothing
  }

  _write<A extends ResponsePayload>(payload: A, encoding: string, next: Function) {
    let id = payload.id
    let isResult = !!payload.result
    if (isResult) {
      let callback = this._callbacks.get(id.toString())
      if (callback) {
        callback(payload)
      } else if (this.strict) {
        console.error(`${this.name}: Can not find response callback for id ${id}`)
      }
    }
    next()
  }
}
