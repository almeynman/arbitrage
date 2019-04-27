'use strict'

const { PubSub } = require('@google-cloud/pubsub')
const { serialize } = require('arbitrage-lib')
const exchanges = require('arbitrage-lib/src/exchanges')

const FETCH_EXCHANGE_RATES_TOPIC = 'fetch-rates-for-exchange'

const pubsub = new PubSub()

exports.minuteTickProcessor = () => {
  const topic = pubsub.topic(FETCH_EXCHANGE_RATES_TOPIC)
  return Promise.all(
    exchanges.map(exchange => {
      console.log(`Triggering market rate fetch for exchange: ${exchange}`)
      return topic.publish(
        serialize({
          exchange,
        }),
      )
    }
    ),
  )
}
