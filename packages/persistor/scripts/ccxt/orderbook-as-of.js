const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const id = 'kraken'

;(async function main() {
  const exchange = new ccxt[id]()
  let since = exchange.parse8601 ('2019-05-26T08:11:00Z')
  const symbol = 'BTC/EUR'
  const limit = 20 // change for your limit
  const trades = await exchange.fetchTrades (symbol, since, limit)
  fs.writeFileSync('./scripts/ccxt/orderbook-as-of.ignore.json', stringify(trades))
})()
