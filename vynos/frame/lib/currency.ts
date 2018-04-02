import BigNumber = require('bignumber.js')
const price = require('crypto-price')
const fixer = require('fixer-api')

export default class Currency {
  private static _instance: Currency

  _cacheTime: number
  _toCacheArray: Map<string, number>
  _fromCacheArray: Map<string, number>

  private _timer: any

  constructor (cacheTime?: number) {
    let cacheTimeInMs: number = 30000
    if (cacheTime !== undefined) {
      if (cacheTime < 1) {
        cacheTime = 1
      }
      cacheTimeInMs = cacheTime * 1000
    }
    this._cacheTime = cacheTimeInMs
    this._toCacheArray = new Map<string, number>()
    this._fromCacheArray = new Map<string, number>()
    this.runInterval(cacheTimeInMs)
  }

  static instance (): Currency {
    // tslint:disable-next-line:strict-type-predicates
    if (Currency._instance === undefined) {
      Currency._instance = new Currency()
    }
    return Currency._instance
  }

  async runInterval (interval: number) {
    this._timer = setInterval(async () => {
      this._toCacheArray.forEach(async (_, key) => {
        this._toCacheArray.set(key, await this.getFixerRate(key))
      })

      this._fromCacheArray.forEach(async (_, key) => {
        this._fromCacheArray.set(key, await this.getCryptoPriceRate(key))
      })
    }, interval)

    return this._timer
  }

  async convertCryptoOrCurrencyToCurrency (amount: BigNumber.BigNumber | number, fromCurrencyCode: string, toCurrencyCode: string): Promise<BigNumber.BigNumber> {
    let result: BigNumber.BigNumber = new BigNumber.BigNumber(0)
    if (!this._fromCacheArray.has(fromCurrencyCode)) {
      this._fromCacheArray.set(fromCurrencyCode, await this.getCryptoPriceRate(fromCurrencyCode))
    }
    if (!this._toCacheArray.has(toCurrencyCode)) {
      this._toCacheArray.set(toCurrencyCode, await this.getFixerRate(toCurrencyCode))
    }
    try {
      let bigNumberAmount = new BigNumber.BigNumber(amount)
      let toCurrencyRate = toCurrencyCode === 'USD'
        ? new BigNumber.BigNumber(1.0)
        : new BigNumber.BigNumber(this._toCacheArray.get(toCurrencyCode) || 0)
      let fromCurrencyToUSDRate = new BigNumber.BigNumber(this._fromCacheArray.get(fromCurrencyCode) || 0)
      let totalRate = toCurrencyRate.mul(fromCurrencyToUSDRate)
      result = bigNumberAmount.mul(totalRate)
    } catch (e) {
      console.error(e)
    }
    return new Promise<BigNumber.BigNumber>(resolve => {resolve(result)})
  }

  async getFixerRate (toCurrencyCode: string): Promise<number> {
    let result: number
    try {
      if (toCurrencyCode === 'USD') {
        result = 1.0
      } else {
        result = (await fixer.latest({ base: 'USD', symbols: [toCurrencyCode] })).rates[toCurrencyCode]
      }
    } catch (e) {
      console.error(e)
    }
    return new Promise<number>(resolve => {resolve(result)})
  }

  async getCryptoPriceRate (fromCurrencyCode: string): Promise<number> {
    let result: number
    try {
      result = parseFloat((await price.getBasePrice(fromCurrencyCode, 'USD')).price)
    } catch (e) {
      console.error(e)
    }
    return new Promise<number>(resolve => {resolve(result)})
  }
}
