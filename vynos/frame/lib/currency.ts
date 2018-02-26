import BigNumber = require('bignumber.js')
const price = require('crypto-price')
const fixer = require('fixer-api');

async function convertCryptoOrCurrencyToCurrency(amount : BigNumber.BigNumber | number, fromCurrencyCode : string, toCurrencyCode : string) : Promise<BigNumber.BigNumber> {
  let bigNumberAmount = new BigNumber.BigNumber(amount)
  let toCurrencyRate = toCurrencyCode === 'USD'
    ? new BigNumber.BigNumber(1.0)
    : new BigNumber.BigNumber((await fixer.latest({ base: 'USD', symbols: [toCurrencyCode] })).rates[toCurrencyCode])
  let fromCurrencyToUSDRate = new BigNumber.BigNumber((await price.getBasePrice(fromCurrencyCode, 'USD')).price)
  let totalRate = toCurrencyRate.mul(fromCurrencyToUSDRate)
  return new Promise<BigNumber.BigNumber>(resolve => {resolve(bigNumberAmount.mul(totalRate))})
}
