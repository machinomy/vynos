import _ = require('lodash')
import Web3 = require('web3')
import moment = require('moment')

const DENOMINATIONS = [
  'kwei',
  'mwei',
  'gwei',
  'szabo',
  'finney',
  'ether',
  'kether',
  'mether',
  'gether',
  'tether'
]

export interface Amount {
  value: string
  denomination: string
}

export function formatAmount (wei: number): Amount {
  let web3 = new Web3()
  let shortestDenomination = _.minBy(DENOMINATIONS, d => {
    return web3.fromWei(wei, d).toString().length
  })
  let denomination = shortestDenomination || 'wei'
  let value = web3.fromWei(wei, shortestDenomination || 'wei').toString()
  return { value, denomination }
}

export function formatDate (timestamp: number): string {
  let date = new Date(timestamp)
  return moment(date).format('D MMM')
}
