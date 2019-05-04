const { PubSub } = require('@google-cloud/pubsub')
const { serialize, exchanges, topics } = require('arbitrage-lib')

const pubsub = new PubSub()

exports.minuteTickProcessor = async () => {
  const topic = pubsub.topic(topics.EXCHANGE_TICK)
  return Promise.all(
    exchanges.map(exchange => {
      console.log(`Triggering exchange tick for exchange: ${exchange}`)
      return topic.publish(serialize({ exchange }))
    }),
  )
}
