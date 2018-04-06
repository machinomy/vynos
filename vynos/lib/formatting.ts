import * as Web3 from 'web3'
import * as moment from 'moment'
import * as BigNumber from 'bignumber.js'

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
  if (wei) {
    let web3 = new Web3()
    let bigNumberWei = new BigNumber.BigNumber(wei)
    let shortestDenomination: string = ""
    let _min: number
    DENOMINATIONS.forEach(d => {
      let candidate = web3.fromWei(bigNumberWei, d as Web3.Unit).toString().length
      if (!_min || candidate < _min) {
        _min = candidate
        shortestDenomination = d
      }
    })
    let denomination = shortestDenomination || 'wei'
    let value = web3.fromWei(bigNumberWei, (shortestDenomination || 'wei') as Web3.Unit).toString()
    return { value, denomination }
  } else {
    return { value: '0', denomination: 'wei' }
  }
}

export function formatDate (timestamp: number): string {
  let date = new Date(timestamp)
  let result
  if (moment(date).isSame(new Date(), 'day')) {
    result = 'just ' + moment(date).format('hh:mm:ss')
  } else if (moment(date).isSame(new Date(), 'year')) {
    result = moment(date).format('D MMM, hh:mm:ss')
  } else {
    result = moment(date).format('D MMM YY, hh:mm:ss')
  }
  return result
}
