import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'

export default class Exchange {

  constructor(
    public orderBook: OrderBook,
    public fees: ExchangeFees = new ExchangeFees(0, 0)
  ) {}

  getBuyCost(): number {
    const buyPrice = this.orderBook.getBestBuyPrice();
    return buyPrice + this.fees.buy * buyPrice
  }

  getSellCost(): number {
    const sellPrice = this.orderBook.getBestSellPrice();
    return sellPrice - this.fees.sell * sellPrice
  }
}
