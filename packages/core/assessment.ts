interface AssessmentArgs {
  symbol: string;
  coefficient: number;
  buy: AssessmentTrade;
  sell: AssessmentTrade;
}

interface AssessmentTrade {
  exchange: string;
  price: number;
  expectedFee: number;
}

export default class Assessment {
  symbol: string;
  coefficient: number;
  buy: AssessmentTrade;
  sell: AssessmentTrade;

  constructor(args: AssessmentArgs) {
    this.symbol = args.symbol;
    this.coefficient = args.coefficient;
    this.buy = args.buy;
    this.sell = args.sell;
  }

  isOpportunity(): boolean {
    return this.coefficient > 1
  }
}

