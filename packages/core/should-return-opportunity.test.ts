import Opportunist from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'
import Order from './order'
import Assessment from './assessment'
import Market from './market'

test('should return opportunity found', () => {
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
      0.04,
      0.03,
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
      0.02,
      0.01,
    )
  )

  const opportunity = new Opportunist().findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).toEqual(new Assessment({
    symbol,
    "coefficient": 1.0566448801742918,
    "buy": {
      "exchange": "kucoin",
      "price": 0.9,
      "expectedFee": 0.02
    },
    "sell": {
      "exchange": "kraken",
      "price": 1.0,
      "expectedFee": 0.03
    }
  }))
})
