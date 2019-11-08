import Assessment from './assessment'
import { Exchange } from './exchange'

interface OpportunistArgs {
  symbol: string
  exchange1: Exchange
  exchange2: Exchange
}

export default class Opportunist {
  findOpportunity({
    symbol,
    exchange1,
    exchange2,
  }: OpportunistArgs): { assessment1: Assessment; assessment2: Assessment } {
    const assessment1 = assess(symbol, exchange1, exchange2)
    const assessment2 = assess(symbol, exchange2, exchange1)

    return { assessment1, assessment2 }
  }
}

function assess(symbol: string, buyIn: Exchange, sellTo: Exchange): Assessment {
  const coefficient = calculateCoefficient({
    buyCost: buyIn.getBuyCost(symbol),
    sellCost: sellTo.getSellCost(symbol),
  })
  return new Assessment({
    symbol,
    coefficient,
    buy: {
      exchange: buyIn.name,
      price: buyIn.getBestBuyPrice(symbol),
      expectedFee: buyIn.takerFee,
    },
    sell: {
      exchange: sellTo.name,
      price: sellTo.getBestSellPrice(symbol),
      expectedFee: sellTo.takerFee,
    },
  })
}

interface CalculateCoefficientArgs {
  sellCost: number
  buyCost: number
}

function calculateCoefficient({
  sellCost,
  buyCost,
}: CalculateCoefficientArgs): number {
  return sellCost / buyCost
}
