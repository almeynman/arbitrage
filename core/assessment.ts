interface AssessmentTrade {
  exchange: string
  price: number
  expectedFee: number
}

export interface Assessment {
  symbol: string
  coefficient: number
  buy: AssessmentTrade
  sell: AssessmentTrade
  isOpportunity: boolean
}

export interface CreateAssessmentArgs {
  symbol: string
  coefficient: number
  buy: AssessmentTrade
  sell: AssessmentTrade
}

export const createAssessment = ({
  symbol,
  coefficient,
  buy,
  sell,
}: CreateAssessmentArgs): Assessment => ({
  symbol,
  coefficient,
  buy,
  sell,
  isOpportunity: coefficient > 1,
})
