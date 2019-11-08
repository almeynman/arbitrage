import { Order } from './order'
import { createOrderBook } from './order-book'

const orderBook = createOrderBook({
  buyWall: [{ price: 1.1, volume: 0 }, { price: 1, volume: 0 }],
  sellWall: [{ price: 1.1, volume: 0 }, { price: 1, volume: 0 }],
})

test('should find the best buy price', () => {
  expect(orderBook.bestBuyPrice).toBe(1.1)
})

test('should find the best sell price', () => {
  expect(orderBook.bestSellPrice).toBe(1)
})

test('should throw if empty buy wall', () => {
  const args = {
    buyWall: [] as Order[],
    sellWall: [{ price: 1.1, volume: 0 }, { price: 1, volume: 0 }],
  }
  let catched = 0
  try {
    createOrderBook(args)
  } catch (e) {
    catched += 1
    expect(e.message).toBe(
      `Cannot construct order book: buy or sell wall is empty ${args}`,
    )
  }
  expect(catched).toBe(1)
})

test('should fail appropriately when passed undefined as buyWall', () => {
  const args = {
    buyWall: undefined as Order[], //tslint-ignore
    sellWall: [{ price: 1.1, volume: 0 }, { price: 1, volume: 0 }],
  }
  let catched = 0
  try {
    createOrderBook(args)
  } catch (e) {
    catched += 1
    expect(e.message).toBe(
      `Cannot construct order book: buy or sell wall is empty ${args}`,
    )
  }
  expect(catched).toBe(1)
})

test('should fail appropriately when passed null as buyWall', () => {
  const args = {
    buyWall: null as Order[],
    sellWall: [{ price: 1.1, volume: 0 }, { price: 1, volume: 0 }],
  }
  let catched = 0
  try {
    createOrderBook(args)
  } catch (e) {
    catched += 1
    expect(e.message).toBe(
      `Cannot construct order book: buy or sell wall is empty ${args}`,
    )
  }
  expect(catched).toBe(1)
})

test('should throw if empty sell wall', () => {
  const args = {
    buyWall: [{ price: 1.1, volume: 0 }, { price: 1, volume: 0 }],
    sellWall: [] as Order[],
  }
  let catched = 0
  try {
    createOrderBook(args)
  } catch (e) {
    catched += 1
    expect(e.message).toBe(
      `Cannot construct order book: buy or sell wall is empty ${args}`,
    )
  }
  expect(catched).toBe(1)
})
