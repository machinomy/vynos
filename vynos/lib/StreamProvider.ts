import {Duplex} from "readable-stream";
import Payload, {ResponsePayload} from "./Payload";
import Promise = require('bluebird')
import Web3 = require("web3");

export default class StreamProvider extends Duplex implements Web3.Provider {
  _callbacks: Map<string, Function>
  name: string
  strict: boolean

  constructor(name?: string, strict?: boolean) {
    super({objectMode: true})
    this._callbacks = new Map()
    this.name = `StreamProvider at ${name}` || "StreamProvider"
    this.strict = strict || false
  }

  sendAsync<A extends Payload, B extends ResponsePayload>(payload: A, callback: Function) {
    this.ask<A, B>(payload).then((result: B) => {
      if (result.error) {
        callback(result.error)
      } else {
        callback(null, result)
      }
      return null
    }).catch(error => {
      callback(error, null)
    })
  }

  send<A extends Payload>(payload: A) {
    throw new Error(`Vynos Web3 provider does not support synchronous methods, please use asynchronous style`)
  }

  ask<A extends Payload, B extends ResponsePayload>(payload: A, timeout: number = 0): Promise<B> {
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
    let isResult = !!payload.result || !!payload.error
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
