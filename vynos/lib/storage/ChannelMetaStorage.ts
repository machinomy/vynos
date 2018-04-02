import Datastore = require('nedb')
import Storage from '../Storage'
import { CHANGE_NETWORK } from '../constants'

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

  constructor () {
    let d = new Storage(CHANGE_NETWORK)
    this.datastore = d.ready()
    this.datastore.then()
  }

  save (meta: ChannelMeta): Promise<void> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.insert<ChannelMeta>(meta, err => {
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
        datastore.update({ channelId: channelId }, { $set: { closingTime: time } }, {}, err => {
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
        datastore.findOne<ChannelMeta>({ channelId }, (err, meta) => {
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
        datastore.find<ChannelMeta>(query).sort({ closingTime: -1, openingTime: -1 }).exec((err, metas) => {
          if (err) {
            reject(err)
          } else {
            resolve(metas)
          }
        })
      })
    })
  }

  clear () {
    this.datastore.then(datastore => {
      // https://github.com/louischatriot/nedb/issues/84
      datastore.remove({ }, { multi: true }, function (err, numRemoved) {
        datastore.loadDatabase(function (err) {
          if (err) {
            console.error('Error while deleting channels local database')
            console.error(err)
          }
        })
      })
    })
  }
}
