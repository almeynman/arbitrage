import { createOrderBook } from './order-book'

const orderBook = createOrderBook({
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
  expect(orderBook.bestBuyPrice).toBe(1.1)
})

test('should find the best sell price', () => {
  expect(orderBook.bestSellPrice).toBe(1)
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
    createOrderBook(args)
  } catch (e) {
    catched++;
    expect(e.message).toBe(`Cannot construct order book: buy or sell wall is empty ${args}`)
  }
  expect(catched).toBe(1)
})

test('should fail appropriately when passed undefined as buyWall', () => {
  const args = {
    buyWall: undefined,
    sellWall: [
      { price: 1.1, volume: 0 },
      { price: 1, volume: 0 }
    ]
  }
  let catched = 0
  try {
    createOrderBook(args)
  } catch (e) {
    catched++;
    expect(e.message).toBe(`Cannot construct order book: buy or sell wall is empty ${args}`)
  }
  expect(catched).toBe(1)
})

test('should fail appropriately when passed null as buyWall', () => {
  const args = {
    buyWall: null,
    sellWall: [
      { price: 1.1, volume: 0 },
      { price: 1, volume: 0 }
    ]
  }
  let catched = 0
  try {
    createOrderBook(args)
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
    createOrderBook(args)
  } catch (e) {
    catched++;
    expect(e.message).toBe(`Cannot construct order book: buy or sell wall is empty ${args}`)
  }
  expect(catched).toBe(1)
})
