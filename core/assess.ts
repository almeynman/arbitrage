import { Assessment, createAssessment } from './assessment'
import { Exchange } from './exchange'

interface FindOpportunityArgs {
  symbol: string
  exchange1: Exchange
  exchange2: Exchange
}

interface AssessmentPair {
  assessment1: Assessment
  assessment2: Assessment
}

export const assess = ({
  symbol,
  exchange1,
  exchange2,
}: FindOpportunityArgs): AssessmentPair => {
  const assessment1 = assessScenario(symbol, exchange1, exchange2)
  const assessment2 = assessScenario(symbol, exchange2, exchange1)

  return { assessment1, assessment2 }
}

export type Assess = typeof assess

function assessScenario(
  symbol: string,
  buyIn: Exchange,
  sellTo: Exchange,
): Assessment {
  const coefficient = calculateCoefficient({
    buyCost: buyIn.getBuyCost(symbol),
    sellCost: sellTo.getSellCost(symbol),
  })
  return createAssessment({
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
