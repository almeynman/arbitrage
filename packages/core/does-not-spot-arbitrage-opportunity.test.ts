import test from 'ava'
import findOpportunity from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'
import Order from './order'
import Market from './market'

test('should not spot arbitrage opportunity', t => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [new Order(1.0)],
        sellWall: [new Order(1.0)]
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
        buyWall: [new Order(1.0)],
        sellWall: [new Order(1.0)]
      }
    )
  )
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket }
  )

  const opportunity = findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  t.is(opportunity, null)
})

test('should not spot opportunity with fees', t => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [new Order(1.1)],
        sellWall: [new Order(1.0)]
      }
    ))
  const kraken = new Exchange(
    "kraken",
    { [symbol]: krakenFooBarMarket },
    new ExchangeFees(
      0.06,
      0.05,
    )
  )

  const kucoinFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [new Order(0.9)],
        sellWall: [new Order(1.0)]
      }
    )
  )
  const kucoin = new Exchange(
    "kucoin",
    { [symbol]: kucoinFooBarMarket },
    new ExchangeFees(
      0.1,
      0.03,
    )
  )

  const opportunity = findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  t.is(opportunity, null)
})
