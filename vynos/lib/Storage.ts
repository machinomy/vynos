import Datastore = require('nedb')
import { default as SettingStorage, NetworkSetting } from './storage/SettingStorage'
import { default as bus } from './bus'
import { CHANGE_NETWORK } from './constants'

const settingStorage = new SettingStorage()

export default class Storage {
  datastore: Datastore | undefined
  name: string

  constructor (name: string) {
    this.name = name
    this.datastore = undefined
    this.load().catch(console.error)
    bus.on(CHANGE_NETWORK, async () => {
      await this.load()
    })
  }

  load (): Promise<void> {
    return new Promise(resolve => {
      settingStorage.getNetwork().then((network: NetworkSetting) => {
        this.datastore = new Datastore({ filename: this.name + '_' + network.name, autoload: true })
        this.datastore.loadDatabase(() => {
          resolve()
        })
      })
    })
  }

  ready (): Promise<Datastore> {
    return new Promise(resolve => {
      if (this.datastore) {
        resolve(this.datastore)
      } else {
        this.load().then(() => {
          resolve(this.datastore)
        })
      }
    })
  }
}
