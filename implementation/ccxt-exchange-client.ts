import ExchangeClient from './exchange-client'
import { OrderBook, Order } from 'core'

const ccxt = require('ccxt')

export default class CCXTExchangeClient implements ExchangeClient {
    constructor(private ccxt?: any) {}

    async fetchOrderBook(exchange: string, symbol: string): Promise<OrderBook> {
        const exchangeClass = (this.ccxt || ccxt)[exchange]
        const exchangeInstance = new exchangeClass()
        await exchangeInstance.loadMarkets()
        const ccxtOrderBook = await exchangeInstance.fetchOrderBook(symbol)
        console.log(`CCXT order book for exchange ${exchangeInstance.id}: ${JSON.stringify(ccxtOrderBook)}`)
        const orderBook = this.convertToCoreOrderBook(ccxtOrderBook)
        console.log(`our order book for exchange ${exchangeInstance.id}: ${JSON.stringify(orderBook)}`)
        return orderBook
    }

    private convertToCoreOrderBook(orderBook: any): OrderBook {
        return new OrderBook({
            buyWall: orderBook.bids.map(([price, volume]: any) => new Order(price)),
            sellWall: orderBook.asks.map(([price, volume]: any) => new Order(price))
        })
    }
}
