import OrderBook from './order-book'
import Order from './order'

test('should find the best buy price', () => {
  const orderBook = new OrderBook({
    buyWall: [
      new Order(1.1),
      new Order(1)
    ],
    sellWall: []
  })

  const bestBuyPrice = orderBook.getBestBuyPrice()

  expect(bestBuyPrice).toBe(1)
})

test('should find the best sell price', () => {
  const orderBook = new OrderBook({
    buyWall: [],
    sellWall: [
      new Order(1.1),
      new Order(1)
    ]
  })

  const bestSellPrice = orderBook.getBestSellPrice()

  expect(bestSellPrice).toBe(1.1)
})
