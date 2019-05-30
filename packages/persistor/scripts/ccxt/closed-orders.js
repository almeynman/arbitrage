const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const exchangeId = 'kraken'
const symbol = 'BTC/USD'

;(async function main() {
  let exchange = new ccxt[exchangeId]()
  await exchange.loadMarkets()
  if (exchange.has['fetchClosedOrders']) {
    const closedOrders = exchange.fetchClosedOrders(symbol, null, 10)
    fs.writeFileSync(`./scripts/ccxt/closed-orders.${exchangeId}.ignore.json`, stringify(closedOrders))
  }
})()
