const { PubSub } = require('@google-cloud/pubsub')
const { serialize, deserialize, symbols, topics } = require('arbitrage-lib')

const pubsub = new PubSub()

exports.exchangeTickProcessor = async event => {
  const { exchangeId } = deserialize(event.data)
  const topic = pubsub.topic(topics.EXCHANGE_SYMBOL_TICK)
  return publishExchangeSymbolTicks(topic, exchangeId, symbols)
}

const publishExchangeSymbolTicks = (topic, exchangeId, symbols) =>
  Promise.all(
    symbols.map(symbol => {
      console.log(`Triggering exchange symbol tick for exchange ${exchangeId} and symbol ${symbol}`)
      return topic.publish(serialize({ exchangeId, symbol }))
    }),
  )
