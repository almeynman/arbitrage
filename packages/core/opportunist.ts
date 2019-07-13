import Exchange from './exchange'
import Market from './market'
import Assessment from './assessment'

interface OpportunistArgs {
  symbol: string,
  exchange1: Exchange,
  exchange2: Exchange,
}

export default class Opportunist {
  findOpportunity({
    symbol,
    exchange1,
    exchange2,
  }: OpportunistArgs): Assessment {
    const assessment1 = assess(symbol, exchange1, exchange2)
    console.log(JSON.stringify({
      buyExchange: exchange1.name,
      sellExchange: exchange2.name,
      opportunity: assessment1.isOpportunity(),
      assessment: assessment1
    }, null, 4))
    if (assessment1.isOpportunity()) return assessment1

    const assessment2 = assess(symbol, exchange2, exchange1)
    console.log(JSON.stringify({
      buyExchange: exchange1.name,
      sellExchange: exchange2.name,
      opportunity: assessment1.isOpportunity(),
      assessment: assessment1
    }, null, 4))
    if (assessment2.isOpportunity()) return assessment2

    return null
  }
}

function assess(symbol: string, buyIn: Exchange, sellTo: Exchange): Assessment {
  const coefficient = calculateCoefficient({ buyCost: buyIn.getBuyCost(symbol), sellCost: sellTo.getSellCost(symbol), })
  return new Assessment({
    symbol,
    coefficient,
    buy: {
      exchange: buyIn.name,
      price: buyIn.getBestBuyPrice(symbol),
      expectedFee: buyIn.getTakerFee()
    },
    sell: {
      exchange: sellTo.name,
      price: sellTo.getBestSellPrice(symbol),
      expectedFee: sellTo.getTakerFee()
    }
  })
}

interface CalculateCoefficientArgs {
  sellCost: number,
  buyCost: number
}

function calculateCoefficient({ sellCost, buyCost }: CalculateCoefficientArgs): number {
  return sellCost / buyCost
}
