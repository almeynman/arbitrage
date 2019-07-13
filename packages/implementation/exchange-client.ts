import { OrderBook } from 'core'

export default interface ExchangeClient {
    fetchOrderBook(exchange: string, symbol: string): Promise<OrderBook>
}
