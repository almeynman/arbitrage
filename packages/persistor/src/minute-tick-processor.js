const { PubSub } = require('@google-cloud/pubsub')
const { serialize, exchangeIds, topics } = require('arbitrage-lib')

const pubsub = new PubSub()

exports.minuteTickProcessor = async () => {
  const topic = pubsub.topic(topics.EXCHANGE_TICK)
  return publishExchangeTicks(topic.publish, exchangeIds)
}

const publishExchangeTicks = (publish, exchangeIds) =>
  Promise.all(
    exchangeIds.map(exchangeId => {
      console.log(`Triggering exchange tick for exchange: ${exchangeId}`)
      return publish(serialize({ exchangeId }))
    }),
  )
