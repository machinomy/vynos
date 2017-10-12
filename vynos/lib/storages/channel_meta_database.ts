import Web3 = require('web3')
import Engine from 'machinomy/lib/engines/engine'

const namespaced = (namespace: string | null | undefined, kind: string): string => {
  let result = kind
  if (namespace) {
    result = namespace + ':' + kind
  }
  return result
}

export interface Meta {
  channelId: string,
  title?: string,
  desc?: string,
  host: string,
  icon?: string
}

/**
 * Database layer for {MetaChannel}
 */
export default class ChannelMetaDatabase {
  web3: Web3
  engine: Engine
  kind: string

  constructor(web3: Web3, engine: Engine, namespace: string | null) {
    this.web3 = web3
    this.kind = namespaced(namespace, 'channel_meta')
    this.engine = engine
  }

  save(meta: Meta): Promise<void> {
    let document = {
      channelId: meta.channelId,
      kind: this.kind,
      title: meta.title,
      desc: meta.desc,
      host: meta.host,
      icon: meta.icon
    }
    return this.engine.insert(document)
  }

  insertIfNotExists(meta: Meta): Promise<void> {
    return this.firstById(meta.channelId).then(found => {
      if (!found) {
        return this.save(meta)
      }
      return;
    })
  }

  firstById(channelId: string): Promise<MetaChannel | null> {
    let query = {
      kind: this.kind,
      channelId: channelId
    }
    // log.info(`ChannelsDatabase#findById Trying to find channel by id ${channelId.toString()}`)
    return this.engine.findOne<MetaChannel>(query).then(document => {
      if (document) {
        return Promise.resolve(document);
      } else {
        // log.info(`ChannelsDatabase#findById Could not find document by id ${channelId.toString()}`)
        return Promise.resolve(null)
      }
    })
  }

  findByIds(arrChannelIds: [string]): Promise<Array<MetaChannel>> {
    var queryChannelIds = arrChannelIds.map(channelId => {
      return {channelId: channelId}
    })
    return this.engine.find({
      $and: [{kind: this.kind}, {$or: queryChannelIds}]
    })
  }

  find(q: object): Promise<Array<MetaChannel>> {
    let query = Object.assign({kind: this.kind}, q)
    return this.engine.find(query)
  }
}

export class MetaChannel {
  channelId: string
  title?: string
  desc?: string
  host: string
  icon?: string

  constructor(channelId: string, title: string, desc: string, host: string, icon: string) {
    this.channelId = channelId
    this.title = title
    this.desc = desc
    this.host = host
    this.icon = icon
  }
}
