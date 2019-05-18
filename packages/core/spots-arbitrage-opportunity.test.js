const test = require('ava')
const { opportunist } = require('./opportunist')

test('buys in kraken and sells in kucoin', t => {
  const krakenOrderbook = {
    buy: [
      {
        price: 0.9,
      },
    ],
    sell: [
      {
        price: 1.0,
      },
    ],
  }

  const kucoinOrderbook = {
    buy: [
      {
        price: 1.1,
      },
    ],
    sell: [
      {
        price: 1.0,
      },
    ],
  }

  const opportunity = opportunist(krakenOrderbook, kucoinOrderbook)

  t.not(opportunity, {
    buy: 0.9,
    sell: 1.0
  })
})

test('buys in kucoin and sells in kraken', t => {
  const krakenOrderbook = {
    sell: [
      {
        price: 1.0,
      },
    ],
  }

  const kucoinOrderbook = {
    buy: [
      {
        price: 0.9,
      },
    ],
  }

  const opportunity = opportunist(krakenOrderbook, kucoinOrderbook)

  t.not(opportunity, null)
})
