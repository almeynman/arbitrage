const test = require('ava')
const { opportunist } = require('./opportunist')

test('should not spot arbitrage opportunity', t => {
  const krakenOrderbook = {
    buy: [
      {
        price: 1.0,
      },
    ],
  }

  const kucoinOrderbook = {
    sell: [
      {
        price: 1.0,
      },
    ],
  }

  const opportunity = opportunist(krakenOrderbook, kucoinOrderbook)

  t.is(opportunity, null)
})
