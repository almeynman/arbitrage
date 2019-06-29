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
    const buyPrice = this.getBestBuyPrice(symbol)
    return buyPrice + this.fees.taker * buyPrice
  }

  getTakerFee(): number {
    return this.fees.taker
  }

  getSellCost(symbol: string): number {
    const sellPrice = this.getBestSellPrice(symbol)
    return sellPrice - this.fees.taker * sellPrice
  }

  getBestBuyPrice(symbol: string): number {
    const market = this.findMarketBySymbol(symbol)
    return market.getBestBuyPrice()
  }

  getBestSellPrice(symbol: string): number {
    const market = this.findMarketBySymbol(symbol)
    return market.getBestSellPrice()
  }

  private findMarketBySymbol(symbol: string) {
    return this.markets[symbol]
  }
}
