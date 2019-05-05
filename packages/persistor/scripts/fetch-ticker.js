const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const exchangeId = 'kraken'
const symbol = 'BTC/USD'

;(async function main() {
  let exchange = new ccxt[exchangeId]()
  await exchange.loadMarkets()
  const ticker = await exchange.fetchTicker(symbol)
  fs.writeFileSync('./scripts/fetch-ticker.ignore.json', stringify(ticker))
})()
