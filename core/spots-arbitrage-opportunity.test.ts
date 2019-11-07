import Opportunist from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import Order from './order'
import { Market, createMarket } from './market'
import { createOrderBook } from './order-book';

test('buys in kraken and sells in kucoin', () => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook(
      {
        buyWall: [{ price: 0.9, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  })
  const kraken = new Exchange(
    "kraken",
    { [symbol]: krakenFooBarMarket }
  )

  const kucoinFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook(
      {
        buyWall: [{ price: 1.1, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  })
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket }
  )

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).not.toBeNull()
})

test('buys in kucoin and sells in kraken', () => {
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
    { [symbol]: krakenFooBarMarket }
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
  )

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).not.toBeNull()
})

test('should spot opportunity with fees', () => {
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
    new ExchangeFees(
      0.01
    )

  )

  const kucoinFooBarMarket = createMarket({
    symbol,
    orderBook: createOrderBook(
      {
        buyWall: [{ price: 0., volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  })
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket },
    new ExchangeFees(
      0.01
    )
  )

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).not.toBeNull()
})
