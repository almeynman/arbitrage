const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const exchangeId = 'okex'
const symbol = 'BTC/USD'

;(async function main() {
  let exchange = new ccxt[exchangeId]()
  await exchange.loadMarkets()
  fs.writeFileSync(`./scripts/ccxt/exchange-market-fees.${exchangeId}.ignore.json`, stringify(exchange.markets))
})()
