import ExchangeFees from './exchange-fees'
import { OrderBook } from './order-book'

export default class Market {

  constructor(
    public symbol: string,
    public orderBook: OrderBook,
    public liquidityThreshold: number = 0.001,
  ) {}

  getSymbol(): string {
    return this.symbol
  }

  bestBuyPrice(): number {
    return this.orderBook.bestBuyPrice
  }

  bestSellPrice(): number {
    return this.orderBook.bestSellPrice
  }

  isLiquid(): boolean {
    const sellPrice = this.bestSellPrice()
    const buyPrice = this.bestBuyPrice()
    return ((sellPrice - buyPrice) / sellPrice) < this.liquidityThreshold
  }
}
