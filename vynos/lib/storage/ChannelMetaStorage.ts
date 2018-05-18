import Datastore = require('nedb')
import Storage from '../Storage'

export interface ChannelMeta {
  channelId: string
  title: string
  host: string
  icon?: string
  openingTime?: number
  closingTime?: number
}

/**
 * Database layer for {MetaChannel}
 */
export default class ChannelMetaStorage {
  datastore: Promise<Datastore>

  private d: Storage | undefined

  constructor () {
    this.d = new Storage('channels')
    this.datastore = this.d.ready()
    this.datastore.then()
  }

  save (meta: ChannelMeta): Promise<void> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.insert<ChannelMeta>(meta, (err: Error) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
  }

  setClosingTime (channelId: string, time: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.update({ channelId: channelId }, { $set: { closingTime: time } }, {}, (err: Error) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
  }

  insertIfNotExists (meta: ChannelMeta): Promise<void> {
    return this.firstById(meta.channelId).then(found => {
      if (!found) {
        return this.save(meta)
      }
      return undefined
    })
  }

  firstById (channelId: string): Promise<ChannelMeta | null> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.findOne<ChannelMeta>({ channelId }, (err: Error, meta: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(meta)
          }
        })
      })
    })
  }

  findByIds (ids: Array<string>): Promise<Array<ChannelMeta>> {
    let orQuery = ids.map(id => {
      return { channelId: id }
    })
    let query = { $or: orQuery }
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.find<ChannelMeta>(query).sort({ closingTime: -1, openingTime: -1 }).exec((err: Error, metas: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(metas)
          }
        })
      })
    })
  }

  clear (cb: () => void) {
    this.datastore.then(datastore => {
      // https://github.com/louischatriot/nedb/issues/84
      datastore.remove({ }, { multi: true }, function (err: Error, numRemoved: number) {
        datastore.loadDatabase(function (err: Error) {
          if (err) {
            console.error('Error while deleting channels local database')
            console.error(err)
          }
          cb()
        })
      })
    })
  }

  changeNetwork (): Promise<void> {
    return new Promise(() => {
      this.d!.load().then(() => {
        this.datastore = this.d!.ready()
      })
    })
  }
}
