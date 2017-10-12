import Web3 = require('web3')
import Engine from 'machinomy/lib/engines/engine'
import EngineMongo from 'machinomy/lib/engines/engine_mongo'
import EngineNedb from 'machinomy/lib/engines/engine_nedb'

import ChannelMetaDatabase from './storages/channel_meta_database'
const defaultEngineName = 'nedb'


export const channels = (web3: Web3, engine: Engine, namespace: string | null): ChannelMetaDatabase => {
  return new ChannelMetaDatabase(web3, engine, namespace)
}

/**
 * Instantiate a storage engine.
 */
export const engine = (path: string, inMemoryOnly: boolean = false, engineName: string = defaultEngineName): Engine => {
  if (engineName === 'nedb') {
    return new EngineNedb(path, inMemoryOnly)
  } else if (engineName === 'mongo') {
    return new EngineMongo(path, inMemoryOnly)
  } else {
    throw new Error('Can not detect datastore enigine')
  }
}

export default class Storage {
  namespace: string|null
  // db: any
  channelMeta: ChannelMetaDatabase

  constructor (web3: Web3, path: string, namespace: string|null, inMemoryOnly?: boolean, engineName: string = defaultEngineName) {
    let storageEngine = engine(path, inMemoryOnly, engineName)
    this.namespace = namespace || null
    // this.db = storageEngine.datastore
    this.channelMeta = channels(web3, storageEngine, namespace)
  }
}

/**
 * Build an instance of Storage.
 */
export const build = (web3: Web3, path: string, namespace: string | null = null, inMemoryOnly?: boolean, engineName: string = defaultEngineName): Storage => {
  return new Storage(web3, path, namespace, inMemoryOnly, engineName)
}
