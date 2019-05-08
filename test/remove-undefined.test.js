const test = require('ava')
const { removeUndefined } = require('../src')

test('removes undefined field', t => {
  const obj = { foo: undefined }
  const actual = removeUndefined(obj)
  t.deepEqual({}, actual)
})

test('removes undefined field recursively', t => {
  const obj = { foo: 'bar', baz: { data: undefined } }
  const actual = removeUndefined(obj)
  t.deepEqual({foo: 'bar', baz: {}}, actual)
})

test('removes recursively from array', t => {
  const obj = { foo: 'bar', baz: [{ data: undefined }] }
  const actual = removeUndefined(obj)
  t.log(JSON.stringify(actual))
  t.deepEqual({foo: 'bar', baz: [{}]}, actual)
})
