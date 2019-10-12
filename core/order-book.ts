import Order from './order'

interface OrderBookArgs {
  buyWall: Array<Order>,
  sellWall: Array<Order>
}

function highestPrice(order1: Order, order2: Order) {
  return order2.price - order1.price
}

function lowestPrice(order1: Order, order2: Order) {
  return order1.price - order2.price
}


export default class OrderBook {
  buyWall: Array<Order>;
  sellWall: Array<Order>;

  constructor(args: OrderBookArgs) {
    if (args.buyWall == null || args.buyWall.length == 0 || args.sellWall == null || args.sellWall.length == 0) {
      throw new Error(`Cannot construct order book: buy or sell wall is empty ${args}`)
    }
    this.buyWall = args.buyWall;
    this.sellWall = args.sellWall;
  }

  getBestBuyPrice(): number {
    return this.buyWall.sort(highestPrice)[0].price;
  }

  getBestSellPrice(): number {
    return this.sellWall.sort(lowestPrice)[0].price;
  }
}
