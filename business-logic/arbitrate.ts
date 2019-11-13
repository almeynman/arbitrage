import R from 'ramda'

import {
  Assess,
  assess as defaultAssess,
  AssessmentRepository,
  createExchange,
  createExchangeFees,
  createMarket,
  Exchange,
  ExchangeClient,
  OrderBook,
} from '.'

export interface ExchangeArgs {
  name: string;
  fees: {
    taker: number;
  };
}

export interface ArbitrateArgs {
  exchangeClient: ExchangeClient;
  assessmentRepository: AssessmentRepository;
  exchanges: ExchangeArgs[];
  symbol: string;
  assess?: Assess;
}

export type Arbitrate = typeof arbitrate

export async function arbitrate({
  exchangeClient,
  assessmentRepository,
  exchanges,
  symbol,
  assess = defaultAssess,
}: ArbitrateArgs): Promise<void> {
  const orderBooks = await fetchOrderBooks(exchanges, exchangeClient, symbol)
  const [exchange1, exchange2] = instantiateExchanges(exchanges, orderBooks, symbol)

  const market1 = exchange1.markets[symbol]
  const market2 = exchange2.markets[symbol]

  if (!market1.isLiquid) {
    throw new Error(`One of the markets is illiquid ${JSON.stringify(market1, null, 4)}`)
  }

  if (!market2.isLiquid) {
    throw new Error(`One of the markets is illiquid ${JSON.stringify(market2, null, 4)}`)
  }

  const { assessment1, assessment2 } = assess({
    symbol,
    exchange1,
    exchange2,
  })
  await Promise.all([assessmentRepository.save(assessment1), assessmentRepository.save(assessment2)])
}

function instantiateExchanges(
  exchanges: ExchangeArgs[],
  orderBooks: OrderBook[],
  symbol: string,
): [Exchange, Exchange] {
  const [exchange1, exchange2] = R.zip(exchanges, orderBooks).map(([exchange, orderBook]) => {
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
  exchangeClient: ExchangeClient,
  symbol: string,
): Promise<OrderBook[]> {
  return Promise.all(exchanges.map(exchange => exchangeClient.fetchOrderBook(exchange.name, symbol)))
}
