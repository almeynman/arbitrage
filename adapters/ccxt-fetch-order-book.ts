import * as ccxt from "ccxt"
import { createOrderBook, OrderBook } from "business-logic"
import { pipe } from 'fp-ts/lib/pipeable'
import { tryCatch, map, TaskEither, chain } from 'fp-ts/lib/TaskEither'

type CcxtExchangeClass = typeof ccxt.Exchange
export type Ccxt = ccxt.Dictionary<CcxtExchangeClass>
const defaultCcxt = (ccxt as unknown as Ccxt)

const instantiateExchange = (ccxt: Ccxt, exchange: string): TaskEither<Error, ccxt.Exchange> =>
  tryCatch<Error, ccxt.Exchange>(async () => {
    const exchangeClass = ccxt[exchange]
    const exchangeInstance = new exchangeClass()
    await exchangeInstance.loadMarkets()
    return exchangeInstance
  }, (reason: unknown) => new Error(String(reason)))

const ccxtFetchOrderBook = (symbol: string) => (exchange: ccxt.Exchange): TaskEither<Error, ccxt.OrderBook> => tryCatch<Error, ccxt.OrderBook>(
  () => exchange.fetchOrderBook(symbol),
  (reason: unknown) => new Error(String(reason))
)

const convertToCoreOrderBook = (orderBook: ccxt.OrderBook): OrderBook => createOrderBook({
  buyWall: orderBook.bids.map(([price, volume]: [number, number]) => ({ price, volume })),
  sellWall: orderBook.asks.map(([price, volume]: [number, number]) => ({ price, volume }))
})

export const fetchOrderBook = (ccxt: Ccxt = defaultCcxt) => (symbol: string) => (exchange: string): TaskEither<Error, OrderBook> => pipe(
  instantiateExchange(ccxt, exchange),
  chain(ccxtFetchOrderBook(symbol)),
  map(convertToCoreOrderBook),
)
