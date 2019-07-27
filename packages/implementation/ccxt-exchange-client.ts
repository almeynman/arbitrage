import ExchangeClient from './exchange-client'
import { OrderBook, Order } from 'core'

export default class CCXTExchangeClient implements ExchangeClient {
    constructor(private ccxt: any) {}

    async fetchOrderBook(exchange: string, symbol: string): Promise<OrderBook> {
        const exchangeClass = this.ccxt[exchange]
        const exchangeInstance = new exchangeClass()
        await exchangeInstance.loadMarkets()

        const ccxtOrderBook = await exchangeInstance.fetchOrderBook(symbol)

        const orderBook = this.convertToCoreOrderBook(ccxtOrderBook)
        return orderBook
    }

    private convertToCoreOrderBook(orderBook: any): OrderBook {
        return new OrderBook({
            buyWall: orderBook.bids.map(([price, volume]: any) => new Order(price)),
            sellWall: orderBook.asks.map(([price, volume]: any) => new Order(price))
        })
    }
}
