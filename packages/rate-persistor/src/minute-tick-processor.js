const { PubSub } = require('@google-cloud/pubsub')
const { serialize, exchanges } = require('arbitrage-lib')

const pubsub = new PubSub()

const FETCH_EXCHANGE_RATES_TOPIC = 'fetch-rates-for-exchange'

module.exports = () => {
  const topic = pubsub.topic(FETCH_EXCHANGE_RATES_TOPIC)
  return Promise.all(
    exchanges.map(exchange => {
      console.log(`Triggering market rate fetch for exchange: ${exchange}`)
      return topic.publish(
        serialize({
          exchange,
        }),
      )
    }),
  )
}
