'use strict'

const test = require('ava')
const Buffer = require('safe-buffer').Buffer
const { serialize } = require('../src')

test('serializes payload', t => {
  const data = { message: 'message' }
  const actual = serialize(data)
  t.deepEqual(Buffer.from(JSON.stringify({ data }), 'base64'), actual)
})
