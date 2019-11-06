import ExchangeFees from './exchange-fees'
import Market from './market';

interface Markets {
  [key: string]: Market
}

export default class Exchange {
  constructor(
    public name: string,
    public markets: Markets,
    public fees: ExchangeFees = new ExchangeFees(0)
  ) { }

  getBuyCost(symbol: string): number {
    const buyPrice = this.bestBuyPrice(symbol)
    return buyPrice + this.fees.taker * buyPrice
  }

  getTakerFee(): number {
    return this.fees.taker
  }

  getSellCost(symbol: string): number {
    const sellPrice = this.bestSellPrice(symbol)
    return sellPrice - this.fees.taker * sellPrice
  }

  bestBuyPrice(symbol: string): number {
    const market = this.findMarketBySymbol(symbol)
    const bestBuyPrice = market.bestBuyPrice()
    return bestBuyPrice
  }

  bestSellPrice(symbol: string): number {
    const market = this.findMarketBySymbol(symbol)
    const bestSellPrice = market.bestSellPrice()
    return bestSellPrice
  }

  private findMarketBySymbol(symbol: string) {
    return this.markets[symbol]
  }
}
