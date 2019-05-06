const { deserialize, projectId, removeUndefined } = require('arbitrage-lib')
const ccxt = require('ccxt')
const Firestore = require('@google-cloud/firestore')

const firestore = new Firestore({ projectId })

exports.exchangeTickProcessor = async event => {
  const { exchangeIds, symbol } = deserialize(event.data)
  return exchangeIds.map(id => new ccxt[id]()).then((exchanges) => {
    return Promise.all(exchanges.map(exchange => fetchForExchange(exchange, symbol)))
  })
}

async function fetchForExchange(exchange, symbol, exchangeId) {
  return Promise.all([
    exchange.fetchTicker(symbol),
    exchange.fetchL2OrderBook(symbol)
  ]).then(([ticker, orderBook]) => {
    console.log(`Persisting ticker and order book for exchange ${exchange.id} and symbol ${symbol}`)
    firestore.collection('symbol-tick').add({
      exchangeId,
      symbol,
      ticker: removeUndefined(ticker),
      orderBook: removeUndefined(orderBook),
      timestamp: Date.now()
    })
  })
}