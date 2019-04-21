const test = require('ava')
const sum = require('../src')

test('sums two number', t => {
  t.is(sum(1, 2), 3)
})
