const { PubSub } = require('@google-cloud/pubsub')
const { serialize, deserialize, symbols, topics } = require('arbitrage-lib')

const pubsub = new PubSub()

exports.exchangeTickProcessor = async event => {
  const { exchange } = deserialize(event.data)
  console.log(exchange)
  const topic = pubsub.topic(topics.EXCHANGE_SYMBOL_TICK)
  return Promise.all(
    symbols.map(symbol => {
      console.log(`Triggering exchange symbol tick for exchange ${exchange} and symbol ${symbol}`)
      return topic.publish(serialize({ exchange, symbol }))
    }),
  )
}
