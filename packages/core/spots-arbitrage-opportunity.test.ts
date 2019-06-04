import findOpportunity from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'
import Order from './order'
import Market from './market'

test('buys in kraken and sells in kucoin', t => {
  const symbol = "FOO/BAR"
  const krakenFooBarMarket = new Market(
    symbol,
    new OrderBook(
      {
        buyWall: [new Order(0.9)],
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
        buyWall: [new Order(1.1)],
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

  expect(opportunity).toBeNull()
})

test('buys in kucoin and sells in kraken', t => {
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
    { [symbol]: krakenFooBarMarket }
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
  )

  const opportunity = findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).toBeNull()
})

test('should spot opportunity with fees', () => {
  const kraken = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(1.1)],
        sellWall: [new Order(1.0)]
      }
    ),
    new ExchangeFees(
      0.01,
      0.01,
    )
  );

  const kucoin = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(0.9)],
        sellWall: [new Order(1.0)]
      }
    ),
    new ExchangeFees(
      0.01,
      0.01,
    )
  );

  const opportunity = opportunist(kraken, kucoin)

  expect(opportunity).toBeNull()
})

test('should spot opportunity with fees', () => {
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
      0.01,
      0.01,
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
      0.01,
      0.01,
    )
  )

  const opportunity = findOpportunity({
    symbol,
    exchange1: kraken,
    exchange2: kucoin,
  })

  expect(opportunity).not.toBeNull()
})
