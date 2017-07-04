import {Duplex, Readable, Transform, Writable} from "readable-stream";

export class Substream extends Transform {
  superstream: Multiplex

  constructor(superstream: Multiplex) {
    super()
    this.superstream = superstream
  }

  _transform(chunk: any, encoding: any, next: (err?: any) => void): void {
    this.superstream.push({
      name: name,
      data: chunk,
    })
    return next()
  }
}

export default class Multiplex extends Transform {
  private streams: Map<string, Duplex>
  private ignored: Set<string>
  emitErrors: boolean

  constructor(emitErrors: boolean = false) {
    super()
    this.streams = new Map()
    this.emitErrors = emitErrors
  }

  _transform(chunk: any, encoding: any, next: (err?: any) => void): void {
    let name = chunk.name
    let data = chunk.data
    let substream = this.streams.get(name)
    if (substream) {
      substream.push(data)
    } else {
      if (!this.ignored.has(name)) {
        console.warn(`Orphaned data for stream "${name}"`)
      }
    }
    return next()
  }

  createStream(name: string): Duplex {
    let substream = new Substream(this)
    this.on("end", () => {
      substream.emit("end")
    })
    if (this.emitErrors) {
      this.on("error", () => {
        substream.emit("error")
      })
    }
    this.streams.set(name, substream)
    return substream
  }

  ignoreStream(name: string) {
    this.ignored.add(name)
  }
}
