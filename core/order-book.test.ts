import OrderBook from './order-book'

test('should find the best buy price', () => {
  const orderBook = new OrderBook({
    buyWall: [
      { price: 1.1 },
      { price: 1 }
    ],
    sellWall: []
  })

  const bestBuyPrice = orderBook.getBestBuyPrice()

  expect(bestBuyPrice).toBe(1.1)
})

test('should find the best sell price', () => {
  const orderBook = new OrderBook({
    buyWall: [],
    sellWall: [
      { price: 1.1 },
      { price: 1 }
    ]
  })

  const bestSellPrice = orderBook.getBestSellPrice()

  expect(bestSellPrice).toBe(1)
})
