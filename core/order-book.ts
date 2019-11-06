import Order from './order'

export interface OrderBook {
  buyWall: Array<Order>
  sellWall: Array<Order>
  bestBuyPrice: number
  bestSellPrice: number
}

export const createOrderBook = (args: { buyWall: Array<Order>, sellWall: Array<Order> }): OrderBook => {
  if (args.buyWall == null || args.buyWall.length == 0 || args.sellWall == null || args.sellWall.length == 0) {
    throw new Error(`Cannot construct order book: buy or sell wall is empty ${args}`)
  }

  return {
    buyWall: args.buyWall,
    sellWall: args.sellWall,
    bestBuyPrice: args.buyWall.sort(highestPrice)[0].price,
    bestSellPrice: args.sellWall.sort(lowestPrice)[0].price,
  }
}

function highestPrice(order1: Order, order2: Order) {
  return order2.price - order1.price
}

function lowestPrice(order1: Order, order2: Order) {
  return order1.price - order2.price
}
