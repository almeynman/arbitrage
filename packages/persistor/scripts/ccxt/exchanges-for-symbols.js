const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const symbols = ['BTC/USD', 'ETH/BTC']

;(async function main() {
  const result = []
  for (const exchangeId of ccxt.exchanges) {
    try {
      const exchange = new ccxt[exchangeId]()
      await exchange.loadMarkets()
      for (const symbol of symbols) {
        await exchange.fetchTicker(symbol)
      }
      result.push(exchangeId)
    } catch (e) {
      console.log(e)
    }
  }
  fs.writeFileSync('./scripts/ccxt/exchanges-for-symbol.ignore.json', stringify(result))
})()
