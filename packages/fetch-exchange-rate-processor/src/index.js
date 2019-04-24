'use strict'

const { PubSub } = require('@google-cloud/pubsub')
const { serialize } = require('arbitrage-lib')
const exchanges = require('./exchanges')

const FETCH_EXCHANGE_RATES_TOPIC = 'fetch-exchange-rates'

const pubsub = new PubSub()

exports.subscribe = () => {
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
