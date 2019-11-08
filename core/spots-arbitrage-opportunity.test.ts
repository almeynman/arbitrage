import { createExchange } from './exchange'
import { createExchangeFees } from './exchange-fees'
import { createMarket } from './market'
import Opportunist from './opportunist'
import { createOrderBook } from './order-book'

test('buys in kraken and sells in kucoin', () => {
  const symbol = 'FOO/BAR'
  const krakenFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook({
      buyWall: [{ price: 0.9, volume: 0 }],
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
      buyWall: [{ price: 1.1, volume: 0 }],
      sellWall: [{ price: 1.0, volume: 0 }],
    }),
  })
  const kucoin = createExchange({
    name: 'kucoin',
    markets: { [symbol]: kucoinFooBarMarket },
  })

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).not.toBeNull()
})

test('buys in kucoin and sells in kraken', () => {
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
  })

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).not.toBeNull()
})

test('should spot opportunity with fees', () => {
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
      takerFee: 0.01,
    }),
  })

  const kucoinFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook({
      buyWall: [{ price: 0, volume: 0 }],
      sellWall: [{ price: 1.0, volume: 0 }],
    }),
  })
  const kucoin = createExchange({
    name: 'kucoin',
    markets: { [symbol]: kucoinFooBarMarket },
    fees: createExchangeFees({
      takerFee: 0.01,
    }),
  })

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).not.toBeNull()
})
