const { deserialize, projectId, removeUndefined, collections, topics, serialize } = require('arbitrage-lib')
const { PubSub } = require('@google-cloud/pubsub')
const ccxt = require('ccxt')
const Firestore = require('@google-cloud/firestore')
const { from } = require('rxjs')
const { map, mergeMap, reduce } = require('rxjs/operators')

const firestore = new Firestore({ projectId })
const pubsub = new PubSub()

exports.symbolTickProcessor = async event => {
  const { exchangeIds, symbol } = deserialize(event.data)
  const topic = pubsub.topic(topics.OPPORTUNITY)
  return from(exchangeIds)
    .pipe(
      map(exchangeId => new ccxt[exchangeId]()),
      mergeMap(async exchange => {
        const [ticker, orderBook] = await fetchDataFromExchange(exchange, symbol)
        return { exchange, ticker: removeUndefined(ticker), orderBook: removeUndefined(orderBook) }
      }),
      reduce((acc, { exchange, ticker, orderBook }) => ([ ...acc, {id: exchange.id, ticker, orderBook } ]), []),
      mergeMap(data => Promise.all([
        persist(symbol, data),
        topic.publish(serialize({ symbol, data })),
      ])),
    )
    .toPromise()
}

async function fetchDataFromExchange(exchange, symbol) {
  console.log(`Fetching ticker and order book data from exchange ${exchange.id} and symbol ${symbol}`)
  return Promise.all([exchange.fetchTicker(symbol), exchange.fetchL2OrderBook(symbol)])
}

async function persist(symbol, data) {
  console.log(`Persisting data for symbol ${symbol}`)
  return firestore.collection(collections.SYMBOL_TICK).add({
    symbol,
    data,
    timestamp: Date.now(),
  })
}
