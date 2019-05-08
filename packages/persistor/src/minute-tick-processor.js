const { PubSub } = require('@google-cloud/pubsub')
const { serialize, exchangeIds, topics, symbols } = require('arbitrage-lib')

const pubsub = new PubSub()

exports.minuteTickProcessor = async () => {
  const topic = pubsub.topic(topics.SYMBOL_TICK)
  return publishExchangeTicks(topic, exchangeIds)
}

const publishExchangeTicks = (topic, exchangeIds) =>
  Promise.all(
    symbols.map((symbol) => topic.publish(serialize({ exchangeIds, symbol })))
  )
