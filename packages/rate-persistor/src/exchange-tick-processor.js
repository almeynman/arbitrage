const { PubSub } = require('@google-cloud/pubsub')
const { serialize, deserialize, symbols, topics } = require('arbitrage-lib')

const pubsub = new PubSub()

exports.exchangeTickProcessor = async event => {
  const { exchangeId } = deserialize(event.data)
  const topic = pubsub.topic(topics.EXCHANGE_SYMBOL_TICK)
  return publishExchangeSymbolTicks(topic.publish, exchangeId, symbols)
}

const publishExchangeSymbolTicks = (publish, exchangeId, symbols) =>
  Promise.all(
    symbols.map(symbol => {
      console.log(`Triggering exchange symbol tick for exchange ${exchangeId} and symbol ${symbol}`)
      return publish(serialize({ exchangeId, symbol }))
    }),
  )
