'use strict'

const { deserialize } = require('arbitrage-lib')

exports.fetchRateForExchangeProcessor = async event => {
  const { exchange } = deserialize(event.data)
  console.log(exchange)
}
