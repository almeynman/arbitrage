import { ExchangeFees, createExchangeFees } from './exchange-fees'
import { Market } from './market';

interface Markets {
  [key: string]: Market
}

export default class Exchange {
  constructor(
    public name: string,
    public markets: Markets,
    public fees: ExchangeFees = createExchangeFees({})
  ) { }

  getBuyCost(symbol: string): number {
    const buyPrice = this.bestBuyPrice(symbol)
    return buyPrice + this.fees.takerFee * buyPrice
  }

  getTakerFee(): number {
    return this.fees.takerFee
  }

  getSellCost(symbol: string): number {
    const sellPrice = this.bestSellPrice(symbol)
    return sellPrice - this.fees.takerFee * sellPrice
  }

  bestBuyPrice(symbol: string): number {
    const market = this.findMarketBySymbol(symbol)
    return market.bestBuyPrice
  }

  bestSellPrice(symbol: string): number {
    const market = this.findMarketBySymbol(symbol)
    return market.bestSellPrice
  }

  private findMarketBySymbol(symbol: string) {
    return this.markets[symbol]
  }
}
