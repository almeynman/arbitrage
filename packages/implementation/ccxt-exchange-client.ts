import ExchangeClient from './exchange-client'
import OrderBook from 'core/order-book'
import Order from 'core/order'

export default class CCXTExchangeClient implements ExchangeClient {
    constructor(private ccxt: any) {}

    async fetchOrderBook(exchange: string, symbol: string): Promise<OrderBook> {
        const exchangeClass = this.ccxt[exchange]
        const exchangeInstance = new exchangeClass()

        const orderBook = this.convertToCoreOrderBook(await exchangeInstance.fetchOrderBook(symbol))

        return orderBook
    }

    private convertToCoreOrderBook(orderBook: any): OrderBook {
        return new OrderBook({
            buyWall: orderBook.bids.map((bid: any) => new Order(bid.price)),
            sellWall: orderBook.asks.map((bid: any) => new Order(bid.price))
        })
    }
}