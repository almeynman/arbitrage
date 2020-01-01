import { zip } from 'fp-ts/lib/Array'
import { SaveAssessment } from './save-assessment'
import { FetchOrderBook } from './fetch-order-book'
import { Assess, assess as defaultAssess } from './assess'
import { OrderBook } from './order-book'
import { Exchange, createExchange } from './exchange'
import { createExchangeFees } from './exchange-fees'
import { createMarket } from './market'
import { taskEither, TaskEither, map, right, left, chain } from 'fp-ts/lib/TaskEither'
import { array } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import { Assessment } from './assessment'

export interface ExchangeArgs {
  name: string;
  fees: {
    taker: number;
  };
}

export interface ArbitrateArgs {
  fetchOrderBook: FetchOrderBook;
  saveAssessment: SaveAssessment;
  exchanges: ExchangeArgs[];
  symbol: string;
  assess: Assess;
}

export type Arbitrate = typeof arbitrate

export function arbitrate({
  fetchOrderBook,
  saveAssessment,
  exchanges,
  symbol,
  assess = defaultAssess,
}: ArbitrateArgs): TaskEither<Error, Assessment[]> {
  return pipe(
    fetchOrderBooks(exchanges, fetchOrderBook, symbol),
    map((orderBooks: OrderBook[]) => instantiateExchanges(exchanges, orderBooks, symbol)),
    chain((exchanges) => {
      const [market1, market2] = exchanges.map(ex => ex.markets[symbol])

      if (!market1.isLiquid) {
        return left(new Error(`One of the markets is illiquid ${JSON.stringify(market1, null, 4)}`))
      }

      if (!market2.isLiquid) {
        return left(new Error(`One of the markets is illiquid ${JSON.stringify(market2, null, 4)}`))
      }
      return right(exchanges)
    }),
    map(([exchange1, exchange2]) => assess({
        symbol,
        exchange1,
        exchange2,
      })),
    chain(({ assessment1, assessment2 }) => {
      const tasks = [saveAssessment(assessment1), saveAssessment(assessment2)]
      return array.sequence(taskEither)(tasks)
    })
  )
}

function instantiateExchanges(
  exchanges: ExchangeArgs[],
  orderBooks: OrderBook[],
  symbol: string,
): [Exchange, Exchange] {
  const [exchange1, exchange2] = zip(exchanges, orderBooks).map(([exchange, orderBook]) => {
    return createExchange({
      fees: createExchangeFees({ takerFee: exchange.fees.taker }),
      markets: {
        [symbol]: createMarket({ symbol, orderBook }),
      },
      name: exchange.name,
    })
  })

  return [exchange1, exchange2]
}

function fetchOrderBooks(
  exchanges: ExchangeArgs[],
  fetchOrderBook: FetchOrderBook,
  symbol: string,
): TaskEither<Error, OrderBook[]> {
  const tasks = exchanges.map(exchange => fetchOrderBook(symbol)(exchange.name))
  return array.sequence(taskEither)(tasks)
}
