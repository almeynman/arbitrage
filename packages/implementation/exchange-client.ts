import OrderBook from 'core/order-book'

export default interface ExchangeClient {
    fetchOrderBook(exchange: string, symbol: string): OrderBook
}
