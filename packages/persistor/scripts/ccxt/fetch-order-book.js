const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const exchangeId = 'kraken'
const symbol = 'BTC/USD'

;(async function main() {
  let exchange = new ccxt[exchangeId]()
  await exchange.loadMarkets()
  const orderBook = await exchange.fetchOrderBook(symbol)
  fs.writeFileSync('./scripts/ccxt/fetch-order-book.ignore.json', stringify(orderBook))
})()
