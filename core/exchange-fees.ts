export default class ExchangeFees {
  constructor(public taker: number) {}
  
  static fromJson(object: any, exchange: string): ExchangeFees {
    return new ExchangeFees(object.exchanges[exchange].fees.taker)
  }
}
