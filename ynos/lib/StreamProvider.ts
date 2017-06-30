import {Duplex} from "readable-stream";
import Payload, {Response} from "./Payload";

export default class StreamProvider extends Duplex {
  _callbacks: Map<string, Function>

  constructor() {
    super({objectMode: true})
    this._callbacks = new Map()
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

  _write<A extends Response>(payload: A, encoding: string, next: Function) {
    let id = payload.id
    let isResult = !!payload.result
    if (isResult) {
      let callback = this._callbacks.get(id.toString())
      if (callback) {
        callback(payload)
      } else {
        throw new Error(`Can not find response callback for id ${id}`)
      }
    }
    next()
  }
}
