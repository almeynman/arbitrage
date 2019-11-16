import { OrderBook } from '.'

export interface ExchangeClient {
  fetchOrderBook(exchange: string, symbol: string): Promise<OrderBook>;
}
