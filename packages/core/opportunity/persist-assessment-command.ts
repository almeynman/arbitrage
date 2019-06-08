export default interface PersistOpportunityCommand {
  symbol: String,
  data: Array<ExchangeData>
}

interface ExchangeData {
  id: String,
  ticker: {},
  orderbook: OrderBookData,
}

interface Ticker {
  ticker: {

  }
}

interface OrderBookData {
  asks: Array<OrderData>,
  bids: Array<OrderData>
}

interface OrderData {
  price: number,
  volume: number,
}

