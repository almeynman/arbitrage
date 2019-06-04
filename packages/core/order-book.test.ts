import test from 'ava'

import OrderBook from './order-book'
import Order from './order'

test('should find the best buy price', t => {
  const orderBook = new OrderBook({
    buyWall: [
      new Order(1.1),
      new Order(1)
    ],
    sellWall: []
  })

  const bestBuyPrice = orderBook.getBestBuyPrice()

  t.is(bestBuyPrice, 1)
})

test('should find the best sell price', t => {
  const orderBook = new OrderBook({
    buyWall: [],
    sellWall: [
      new Order(1.1),
      new Order(1)
    ]
  })

  const bestSellPrice = orderBook.getBestSellPrice()

  t.is(bestSellPrice, 1.1)
})
