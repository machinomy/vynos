import Promise = require('bluebird')
import Datastore = require('nedb')
import SettingStorage from "./storage/SettingStorage";
import { default as globalEvents } from "./GlobalEvents";
import { CHANGE_NETWORK } from './constants'

const settingStorage = new SettingStorage()

export default class Storage {
  datastore: Datastore
  name: string

  constructor (name: string) {
    this.name = name
    this.load().catch(console.error)
    globalEvents.on(CHANGE_NETWORK, () => {
      this.load().catch(console.error)
    })
  }

  load (): Promise<void> {
    return new Promise(resolve => {
      settingStorage.getNetwork().then((network: any) => {
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
