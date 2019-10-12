import Opportunist from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'
import Market from './market'

test('should not spot arbitrage opportunity', () => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [{ price: 1.0, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    ))
  const kraken = new Exchange(
    "kraken",
    { [symbol]: krakenFooBarMarket }
  )

  const kucoinFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [{ price: 1.0, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  )
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket }
  )

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).toBeNull()
})

test('should not spot opportunity with fees', () => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [{ price: 1.1, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    ))
  const kraken = new Exchange(
    "kraken",
    { [symbol]: krakenFooBarMarket },
    new ExchangeFees(
      0.06
    )
  )

  const kucoinFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [{ price: 0.9, volume: 0 }],
        sellWall: [{ price: 1.0, volume: 0 }]
      }
    )
  )
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket },
    new ExchangeFees(
      0.1
    )
  )

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).toBeNull()
})
