import ExchangeClient from './exchange-client'
import { OrderBook, Order } from 'core'

const defaultCcxt = require('ccxt')

export default (ccxt: any = defaultCcxt): ExchangeClient => ({
    async fetchOrderBook(exchange: string, symbol: string): Promise<OrderBook> {
        const exchangeClass = ccxt[exchange]
        const exchangeInstance = new exchangeClass()
        await exchangeInstance.loadMarkets()

        const ccxtOrderBook = await exchangeInstance.fetchOrderBook(symbol)
        console.log(`CCXT order book for exchange ${exchangeInstance.id}: ${JSON.stringify(ccxtOrderBook)}`)
        const orderBook = convertToCoreOrderBook(ccxtOrderBook)
        console.log(`our order book for exchange ${exchangeInstance.id}: ${JSON.stringify(orderBook)}`)
        return orderBook
    },
})

function convertToCoreOrderBook(orderBook: any): OrderBook {
    return new OrderBook({
        buyWall: orderBook.bids.map(([price, volume]: any) => ({ price })),
        sellWall: orderBook.asks.map(([price, volume]: any) => ({ price }))
    })
}
