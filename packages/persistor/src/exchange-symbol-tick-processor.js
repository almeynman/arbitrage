const { deserialize, removeUndefined, projectId } = require('arbitrage-lib')
const Firestore = require('@google-cloud/firestore')
const ccxt = require('ccxt')

const firestore = new Firestore({ projectId })

exports.exchangeSymbolTickProcessor = async event => {
  const { exchangeId, symbol } = deserialize(event.data)
  const exchange = new ccxt[exchangeId]()
  return Promise.all([
    exchange.fetchTicker(symbol),
    exchange.fetchL2OrderBook(symbol)
  ]).then(([ticker, orderBook]) => {
    console.log(`Persisting ticker and order book for exchange ${exchangeId} and symbol ${symbol}`)
    firestore.collection('symbol-tick').add({
      exchangeId,
      symbol,
      ticker: removeUndefined(ticker),
      orderBook: removeUndefined(orderBook),
      timestamp: Date.now()
    })
  })
}
