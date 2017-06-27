import {Duplex} from "readable-stream";
import Payload from "./Payload";

export default class StreamProvider extends Duplex {
  _callbacks: Map<number, Function>

  constructor() {
    super({objectMode: true})
    this._callbacks = new Map()
  }

  ask<A extends Payload, B>(payload: A, timeout: number = 0): Promise<B> {
    let id = payload.id
    let result = new Promise<B>((resolve, reject) => {
      let resolved = false

      this._callbacks.set(id, (response: B) => {
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

  _read(n: number) {
    // Do Nothing
  }

  _write<A extends Payload>(payload: A, encoding: string, next: Function) {
    let id = payload.id
    let callback = this._callbacks.get(id)
    if (callback) {
      callback(payload)
    } else {
      throw new Error(`Can not find response callback for id ${id}`)
    }
    next()
  }
}
