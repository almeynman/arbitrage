'use strict'

const Buffer = require('safe-buffer').Buffer

module.exports.serialize = data =>
  Buffer.from(
    JSON.stringify({
      data,
    }),
    'base64'
  )

module.exports.deserialize = data => JSON.parse(Buffer.from(data, 'base64').toString())
