import Datastore = require('nedb')

const networks = require('../../../data/networks.json')
const DEFAULT_NETWORK = 'Ropsten'

export interface Setting {
  name: string
  value: string
}

export interface NetworkSetting {
  name: string
  value: string
}

/**
 * Database layer for {MetaChannel}
 */
export default class SettingStorage {
  datastore: Datastore

  constructor () {
    this.datastore = new Datastore({ filename: 'SettingStorage', autoload: true })
  }

  save (name: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.get(name).then(res => {
        if (res) {
          this.datastore.update({ name }, { $set: { value } }, {}, (err: Error) => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        } else {
          this.datastore.insert<Setting>({ name, value }, (err: Error) => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        }
      })
    })
  }

  get (name: string): Promise<Setting | null> {
    return new Promise((resolve, reject) => {
      this.datastore.loadDatabase(() => {
        this.datastore.findOne<Setting>({ name }, (err: Error, value: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(value)
          }
        })
      })
    })
  }

  getNetwork (): Promise<NetworkSetting> {
    return new Promise((resolve, reject) => {
      this.datastore.loadDatabase(() => {
        this.datastore.findOne<Setting>({ name: 'network' }, (err: Error, res: any) => {
          if (err) {
            reject(err)
          } else {
            let network
            let networkValue

            if (!res) {
              network = DEFAULT_NETWORK
            } else {
              network = res.value
            }

            if (!networks[network]) {
              networkValue = network
            } else {
              networkValue = networks[network]
            }

            resolve({ name: network, value: networkValue })
          }
        })
      })
    })
  }
}
