const { Buffer } = require('safe-buffer')

module.exports.serialize = data => Buffer.from(JSON.stringify(data))
module.exports.deserialize = data => JSON.parse(Buffer.from(data), 'base64')
