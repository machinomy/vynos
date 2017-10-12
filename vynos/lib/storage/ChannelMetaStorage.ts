import Promise = require('bluebird')
import Datastore = require('nedb')

export interface ChannelMeta {
  channelId: string,
  title?: string,
  desc?: string,
  host: string,
  icon?: string
}

/**
 * Database layer for {MetaChannel}
 */
export default class ChannelMetaStorage {
  datastore: Datastore

  constructor () {
    this.datastore = new Datastore({filename: 'channelMetaStorage', autoload: true})
  }

  save(meta: ChannelMeta): Promise<void> {
    return new Promise((resolve, reject) => {
      this.datastore.insert<ChannelMeta>(meta, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  insertIfNotExists(meta: ChannelMeta): Promise<void> {
    return this.firstById(meta.channelId).then(found => {
      if (!found) {
        return this.save(meta)
      }
      return;
    })
  }

  firstById(channelId: string): Promise<ChannelMeta | null> {
    return new Promise((resolve, reject) => {
      this.datastore.findOne<ChannelMeta>({channelId}, (err, meta) => {
        if (err) {
          reject(err)
        } else {
          resolve(meta)
        }
      })
    })
  }

  findByIds(ids: Array<string>): Promise<Array<ChannelMeta>> {
    let orQuery = ids.map(id => { return { channelId: id } })
    let query = {$or: orQuery}
    return new Promise((resolve, reject) => {
      this.datastore.find<ChannelMeta>(query, (err, metas) => {
        if (err) {
          reject(err)
        } else {
          resolve(metas)
        }
      })
    })
  }
}
