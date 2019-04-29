'use strict'

const { minuteTickProcessor } = require('./minute-tick-processor')
const { fetchRateForExchangeProcessor } = require('./fetch-rate-processor')

exports.minuteTickProcessor = minuteTickProcessor
exports.fetchRateForExchangeProcessor = fetchRateForExchangeProcessor
