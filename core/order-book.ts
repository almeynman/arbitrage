import { Order } from './order'

export interface OrderBook {
  buyWall: Order[]
  sellWall: Order[]
  bestBuyPrice: number
  bestSellPrice: number
}

interface CreateOrderBookArgs {
  buyWall: Order[]
  sellWall: Order[]
}

export const createOrderBook = ({ buyWall = [], sellWall = [] }: CreateOrderBookArgs): OrderBook => {
  if (!buyWall || buyWall.length == 0 || !sellWall || sellWall.length == 0) {
    throw new Error(`Cannot construct order book: buy or sell wall is empty ${{ buyWall, sellWall }}`)
  }

  return {
    buyWall: buyWall,
    sellWall: sellWall,
    bestBuyPrice: buyWall.sort(highestPrice)[0].price,
    bestSellPrice: sellWall.sort(lowestPrice)[0].price,
  }
}

function highestPrice(order1: Order, order2: Order) {
  return order2.price - order1.price
}

function lowestPrice(order1: Order, order2: Order) {
  return order1.price - order2.price
}
