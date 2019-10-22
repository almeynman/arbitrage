import Opportunist from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'
import Assessment from './assessment'
import Market from './market'

test('should return opportunity found', () => {
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
      0.04
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
      0.02
    )
  )

  const { assessment1, assessment2 } = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(assessment1.isOpportunity() || assessment2.isOpportunity()).toBe(true)
})
