const { Buffer } = require('safe-buffer')

exports.serialize = data => Buffer.from(JSON.stringify(data))
exports.deserialize = data => JSON.parse(Buffer.from(data, 'base64'))
