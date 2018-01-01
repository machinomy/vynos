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
  let result
  if (moment(date).isSame(new Date(), "day")) {
    result = 'just ' + moment(date).format('hh:mm:ss')
  } else if (moment(date).isSame(new Date(), "year")) {
    result = moment(date).format('D MMM, hh:mm:ss')
  } else {
    result = moment(date).format('D MMM YY, hh:mm:ss')
  }
  return result
}
