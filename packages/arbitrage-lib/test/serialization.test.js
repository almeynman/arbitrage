const test = require('ava')
const Buffer = require('safe-buffer').Buffer
const { serialize, deserialize } = require('../src')

test.skip('serializes payload', t => {
  const data = { message: 'message' }
  const actual = serialize(data)
  t.expect(Buffer.from(JSON.stringify(data))).toEqual(actual)
})

test.skip('deserializes payload', t => {
  const data = serialize({ message: 'message' })
  const actual = deserialize(data)
  t.expect({ message: 'message' }).toEqual(actual)
})
