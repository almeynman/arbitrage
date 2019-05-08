const test = require('ava')
const Buffer = require('safe-buffer').Buffer
const { serialize, deserialize } = require('../src')

test('serializes payload', t => {
  const data = { message: 'message' }
  const actual = serialize(data)
  t.deepEqual(Buffer.from(JSON.stringify(data)), actual)
})

test('deserializes payload', t => {
  const data = serialize({ message: 'message' })
  const actual = deserialize(data)
  t.deepEqual({ message: 'message' }, actual)
})
