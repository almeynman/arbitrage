import Order from './order'

interface OrderBookArgs {
  buyWall: Array<Order>,
  sellWall: Array<Order>
}

function highestPrice(order1: Order, order2: Order) {
  return order1.price - order2.price
}

function lowestPrice(order1: Order, order2: Order) {
  return order2.price - order1.price
}

export default class OrderBook {
  buyWall: Array<Order>;
  sellWall: Array<Order>;

  constructor(args: OrderBookArgs) {
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
