import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'

export default class Market {

  constructor(
    public symbol: string,
    public orderBook: OrderBook
  ) {}

  getSymbol(): string {
    return this.symbol
  }

  getBestBuyPrice(): number {
    return this.orderBook.getBestBuyPrice()
  }

  getBestSellPrice(): number {
    return this.orderBook.getBestSellPrice()
  }
}
