const ccxt = require('ccxt')
const fs = require('fs')
const { stringify } = require('./stringify')

const ids = ['kraken', 'kucoin']

;(async function main() {
  const exchanges = []
  for (const id of ids) {
    let exchange = new ccxt[id]()
    await exchange.loadMarkets()
    exchanges[id] = exchange
  }
  let uniqueSymbols = ccxt.unique(ccxt.flatten(ids.map(id => exchanges[id].symbols)))
  let arbitrableSymbols = uniqueSymbols
    .filter(symbol => ids.filter(id => exchanges[id].symbols.indexOf(symbol) >= 0).length > 1)
    .sort((id1, id2) => (id1 > id2 ? 1 : id2 > id1 ? -1 : 0))

  fs.writeFileSync('./scripts/common-pairs.ignore.json', stringify(arbitrableSymbols))
})()
