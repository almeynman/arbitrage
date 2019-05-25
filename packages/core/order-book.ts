import Order from './order'

interface OrderBookArgs {
  buyWall: Iterable<Order>,
  sellWall: Iterable<Order>
}

export default class OrderBook {
  buyWall: Iterable<Order>;
  sellWall: Iterable<Order>;

  constructor(args: OrderBookArgs) {
    this.buyWall = args.buyWall;
    this.sellWall = args.sellWall;
  }

  getBestBuyPrice() {
    return this.buyWall[0].price;
  }

  getBestSellPrice() {
    return this.sellWall[0].price;
  }
}
