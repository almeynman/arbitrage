'use strict'

exports.fetchRateForExchangeProcessor = async event => {
  console.log('event.data', event.data)
  console.log('BUFFER', Buffer.from(event.data, 'base64').toString())
  const str = JSON.stringify(Buffer.from(event.data, 'base64').toString('ascii'))
  console.log(str)
}
