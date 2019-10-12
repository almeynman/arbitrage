import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'

export default class Market {

  constructor(
    public symbol: string,
    public orderBook: OrderBook,
    public liquidityThreshold: number = 0.001,
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

  isLiquid(): boolean {
    const sellPrice = this.getBestSellPrice()
    const buyPrice = this.getBestBuyPrice()
    return ((sellPrice - buyPrice) / sellPrice) < this.liquidityThreshold
  }
}
