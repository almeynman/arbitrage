import OrderBook from './order-book'

const orderBook = new OrderBook({
  buyWall: [
    { price: 1.1, volume: 0 },
    { price: 1, volume: 0 }
  ],
  sellWall: [
    { price: 1.1, volume: 0 },
    { price: 1, volume: 0 }
  ]
})

test('should find the best buy price', () => {
  const bestBuyPrice = orderBook.getBestBuyPrice()

  expect(bestBuyPrice).toBe(1.1)
})

test('should find the best sell price', () => {
  const bestSellPrice = orderBook.getBestSellPrice()

  expect(bestSellPrice).toBe(1)
})

test('should throw if empty buy wall', () => {
  const args = {
    buyWall: [],
    sellWall: [
      { price: 1.1, volume: 0 },
      { price: 1, volume: 0 }
    ]
  }
  let catched = 0
  try {
    const orderBook = new OrderBook(args)
  } catch (e) {
    catched++;
    expect(e.message).toBe(`Cannot construct order book: buy or sell wall is empty ${args}`)
  }
  expect(catched).toBe(1)
})

test('should throw if empty sell wall', () => {
  const args = {
    buyWall: [
      { price: 1.1, volume: 0 },
      { price: 1, volume: 0 }
    ],
    sellWall: []
  }
  let catched = 0
  try {
    const orderBook = new OrderBook(args)
  } catch (e) {
    catched++;
    expect(e.message).toBe(`Cannot construct order book: buy or sell wall is empty ${args}`)
  }
  expect(catched).toBe(1)
})
