'use strict'

const Buffer = require('safe-buffer').Buffer

exports.subscribe = data => {
  const pubsubMessage = data
  console.log(Buffer.from(pubsubMessage.data, 'base64').toString())
}
