import _ = require('lodash')
import Web3 = require('web3')
import moment = require('moment')
import BigNumber = require('bignumber.js')

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
  let bigNumberWei = new BigNumber.BigNumber(wei)
  let shortestDenomination = _.minBy(DENOMINATIONS, d => {
    return web3.fromWei(bigNumberWei, d as Web3.Unit).toString().length
  })
  let denomination = shortestDenomination || 'wei'
  let value = web3.fromWei(bigNumberWei, (shortestDenomination || 'wei') as Web3.Unit).toString()
  return { value, denomination }
}

export function formatDate (timestamp: number): string {
  let date = new Date(timestamp)
  return moment(date).format('D MMM')
}
