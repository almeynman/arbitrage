const { deserialize, projectId, removeUndefined, collections } = require('arbitrage-lib')
const ccxt = require('ccxt')
const Firestore = require('@google-cloud/firestore')
const { from } = require('rxjs')
const { map, mergeMap, reduce } = require('rxjs/operators')

const firestore = new Firestore({ projectId })

exports.symbolTickProcessor = async event => {
  const { exchangeIds, symbol } = deserialize(event.data)
  return from(exchangeIds)
    .pipe(
      map(exchangeId => new ccxt[exchangeId]()),
      mergeMap(async exchange => {
        const [ticker, orderBook] = await fetchDataFromExchange(exchange, symbol)
        return { exchange, ticker: removeUndefined(ticker), orderBook: removeUndefined(orderBook) }
      }),
      reduce((acc, { exchange, ticker, orderBook }) => ({ ...acc, [exchange.id]: { ticker, orderBook } }), {}),
      map(data => persist(symbol, data)),
    )
    .toPromise()
}

async function fetchDataFromExchange(exchange, symbol) {
  console.log(`Fetching ticker and order book data from exchange ${exchange.id} and symbol ${symbol}`)
  return Promise.all([exchange.fetchTicker(symbol), exchange.fetchL2OrderBook(symbol)])
}

async function persist(symbol, data) {
  console.log(`Persisting data for symbol ${symbol}`)
  firestore.collection(collections.SYMBOL_TICK).add({
    symbol,
    ...data,
    timestamp: Date.now(),
  })
}
