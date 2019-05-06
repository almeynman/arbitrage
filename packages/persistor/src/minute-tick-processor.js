const { PubSub } = require('@google-cloud/pubsub')
const { serialize, exchangeIds, topics, symbols } = require('arbitrage-lib')

const pubsub = new PubSub()

exports.minuteTickProcessor = async () => {
  const topic = pubsub.topic(topics.EXCHANGE_TICK)
  return publishExchangeTicks(topic, exchangeIds)
}

const publishExchangeTicks = (topic, exchangeIds) =>
  Promise.all(
    symbols.forEach((symbol) => topic.publish(serialize({ exchangeIds, symbol })))
  )
