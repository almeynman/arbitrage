import Market from './market'
import Orderbook from './order-book'

test('can determine if market is liquid', () => {
  const market = new Market('BTC/USD', new Orderbook({
    buyWall: [{ price: 100, volume: 0 }],
    sellWall: [{ price: 101, volume: 0 }]
  }), 0.1)
  expect(market.isLiquid()).toBe(true)
})

test('can determine if market is not liquid', () => {
  const market = new Market('BTC/USD', new Orderbook({
    buyWall: [{ price: 100, volume: 0 }],
    sellWall: [{ price: 102, volume: 0 }]
  }), 0.01)
  expect(market.isLiquid()).toBe(false)
})
