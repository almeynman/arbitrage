const Buffer = require('safe-buffer').Buffer
const { serialize, deserialize } = require('../src')

test('serializes payload', () => {
  const data = { message: 'message' }
  const actual = serialize(data)
  expect(Buffer.from(JSON.stringify(data))).toEqual(actual)
})

test('deserializes payload', () => {
  const data = serialize({ message: 'message' })
  const actual = deserialize(data)
  expect({ message: 'message' }).toEqual(actual)
})
