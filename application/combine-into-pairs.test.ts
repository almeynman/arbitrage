import combineIntoPairs from './combine-into-pairs'

test('combines into pairs', async () => {
  let array = ["apple", "banana", "lemon", "mango"];
  const pairs = combineIntoPairs(array)
  expect(pairs).toEqual([
    ['apple', 'banana'],
    ['apple', 'lemon'],
    ['apple', 'mango'],
    ['banana', 'lemon'],
    ['banana', 'mango'],
    ['lemon', 'mango']
  ])
});
