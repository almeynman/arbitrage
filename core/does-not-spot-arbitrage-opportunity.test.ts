import Opportunist from './opportunist'
import Exchange from './exchange'
import { ExchangeFees, createExchangeFees } from './exchange-fees'
import { createOrderBook } from './order-book'
import { createMarket } from './market'

test('should not spot arbitrage opportunity', () => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook(
      {
        buyWall: [{ price: 1.0, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    ),
  })
  const kraken = new Exchange(
    "kraken",
    { [symbol]: krakenFooBarMarket }
  )

  const kucoinFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook(
      {
        buyWall: [{ price: 1.0, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  })
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket }
  )

  const { assessment1, assessment2 } = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(assessment1.isOpportunity()).toBe(false)
  expect(assessment2.isOpportunity()).toBe(false)
})

test('should not spot opportunity with fees', () => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook(
      {
        buyWall: [{ price: 1.1, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  })
  const kraken = new Exchange(
    "kraken",
    { [symbol]: krakenFooBarMarket },
    createExchangeFees({
      takerFee: 0.06
    })
  )

  const kucoinFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook(
      {
        buyWall: [{ price: 0.9, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  })
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket },
    createExchangeFees({
      takerFee: 0.1
    })
  )

  const { assessment1, assessment2 } = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(assessment1.isOpportunity()).toBe(false)
  expect(assessment2.isOpportunity()).toBe(false)
})
