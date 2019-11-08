import { createExchangeFees, ExchangeFees } from './exchange-fees'
import { Market } from './market'

interface Markets {
  [key: string]: Market
}

export interface Exchange {
  name: string
  markets: Markets
  fees: ExchangeFees
  takerFee: number
  getBuyCost: (symbol: string) => number
  getSellCost: (symbol: string) => number
  getBestBuyPrice: (symbol: string) => number
  getBestSellPrice: (symbol: string) => number
}

interface CreateExchangeArgs {
  name: string
  markets: Markets
  fees?: ExchangeFees
}

export const createExchange = ({
  name,
  markets,
  fees = createExchangeFees({}),
}: CreateExchangeArgs): Exchange => {
  const findMarketBySymbol = (symbol: string): Market => markets[symbol]

  return {
    name,
    markets,
    fees,
    takerFee: fees.takerFee,
    getBuyCost(symbol: string): number {
      const buyPrice = this.getBestBuyPrice(symbol)
      return buyPrice + fees.takerFee * buyPrice
    },
    getSellCost(symbol: string): number {
      const sellPrice = this.getBestSellPrice(symbol)
      return sellPrice - fees.takerFee * sellPrice
    },
    getBestBuyPrice(symbol: string): number {
      const market = findMarketBySymbol(symbol)
      return market.bestBuyPrice
    },
    getBestSellPrice(symbol: string): number {
      const market = findMarketBySymbol(symbol)
      return market.bestSellPrice
    },
  }
}
