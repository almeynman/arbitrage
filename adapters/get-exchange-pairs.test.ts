import { combineIntoPairs } from './get-exchange-pairs'

test('combines into pairs', async () => {
  const array = ['apple', 'banana', 'lemon', 'mango']
  const pairs = combineIntoPairs(array)
  expect(pairs).toEqual([
    ['apple', 'banana'],
    ['apple', 'lemon'],
    ['apple', 'mango'],
    ['banana', 'lemon'],
    ['banana', 'mango'],
    ['lemon', 'mango']
  ])
})
