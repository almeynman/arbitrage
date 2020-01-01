import * as ccxt from 'ccxt'
import { mock, instance, when } from 'ts-mockito'
import { fold } from 'fp-ts/lib/Either'
import { OrderBook } from 'business-logic'
import { pipe } from 'fp-ts/lib/pipeable'
import { fetchOrderBook, Ccxt } from './ccxt-fetch-order-book'
import { anOrderBook } from './fixtures'

const mockExchangeClass = (o: ccxt.OrderBook) => class ExchangeMock extends ccxt.Exchange {
    constructor() {
        super()
    }

    loadMarkets(): Promise<ccxt.Dictionary<ccxt.Market>> {
        return Promise.resolve({})
    }

    fetchOrderBook(): Promise<ccxt.OrderBook> {
        return Promise.resolve(o)
    }
}

const mockedCcxt = mock<Ccxt>()
const ccxtInstance = instance(mockedCcxt)

test('should obtain an order book', async () => {
    const anExchange = 'any'
    const aSymbol = 'foobar'

    when(mockedCcxt[anExchange]).thenReturn(mockExchangeClass(anOrderBook))
    const orderBookTask = fetchOrderBook(ccxtInstance)(aSymbol)(anExchange)
    const either = await orderBookTask()

    pipe(
        either,
        fold<Error, OrderBook, void>((err: Error) => {
            console.log(`I'm sorry, I don't know who you are. (${err.message})`)
        }, (o: OrderBook) => {
            expect(o.bestBuyPrice).toBe(0.9)
            expect(o.bestSellPrice).toBe(1)
        })
    )
})
