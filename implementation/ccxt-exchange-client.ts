import defaultCcxt from 'ccxt'
import { createOrderBook, ExchangeClient, OrderBook } from 'core'

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
    return createOrderBook({
        buyWall: orderBook.bids.map(([price, volume]: any) => ({ price, volume })),
        sellWall: orderBook.asks.map(([price, volume]: any) => ({ price, volume }))
    })
}
