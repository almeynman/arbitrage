import { createExchange } from './exchange'
import { createExchangeFees } from './exchange-fees'
import { createMarket } from './market'
import Opportunist from './opportunist'
import { createOrderBook } from './order-book'

test('should not spot arbitrage opportunity', () => {
  const symbol = 'FOO/BAR'
  const krakenFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook({
      buyWall: [{ price: 1.0, volume: 0 }],
      sellWall: [{ price: 1.0, volume: 0 }],
    }),
  })
  const kraken = createExchange({
    name: 'kraken',
    markets: { [symbol]: krakenFooBarMarket },
  })

  const kucoinFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook({
      buyWall: [{ price: 1.0, volume: 0 }],
      sellWall: [{ price: 1.0, volume: 0 }],
    }),
  })
  const kucoin = createExchange({
    name: 'kucoin',
    markets: { [symbol]: kucoinFooBarMarket },
  })

  const { assessment1, assessment2 } = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(assessment1.isOpportunity()).toBe(false)
  expect(assessment2.isOpportunity()).toBe(false)
})

test('should not spot opportunity with fees', () => {
  const symbol = 'FOO/BAR'
  const krakenFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook({
      buyWall: [{ price: 1.1, volume: 0 }],
      sellWall: [{ price: 1.0, volume: 0 }],
    }),
  })
  const kraken = createExchange({
    name: 'kraken',
    markets: { [symbol]: krakenFooBarMarket },
    fees: createExchangeFees({
      takerFee: 0.06,
    }),
  })

  const kucoinFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook({
      buyWall: [{ price: 0.9, volume: 0 }],
      sellWall: [{ price: 1.0, volume: 0 }],
    }),
  })
  const kucoin = createExchange({
    name: 'kucoin',
    markets: { [symbol]: kucoinFooBarMarket },
    fees: createExchangeFees({
      takerFee: 0.1,
    }),
  })

  const { assessment1, assessment2 } = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(assessment1.isOpportunity()).toBe(false)
  expect(assessment2.isOpportunity()).toBe(false)
})
