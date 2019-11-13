import { assess } from './assess'
import { createExchange } from './exchange'
import { createExchangeFees } from './exchange-fees'
import { createMarket } from './market'
import { createOrderBook } from './order-book'

test('should return opportunity found', () => {
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
      takerFee: 0.04,
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
      takerFee: 0.02,
    }),
  })

  const { assessment1, assessment2 } = assess({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(assessment1.isOpportunity || assessment2.isOpportunity).toBe(true)
})
