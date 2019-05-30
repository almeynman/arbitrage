import test from 'ava'
import opportunist from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'
import Order from './order'

test('buys in kraken and sells in kucoin', t => {
  const kraken = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(0.9)],
        sellWall: [new Order(1.0)]
      }
    )
  );

  const kucoin = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(1.1)],
        sellWall: [new Order(1.0)]
      }
    )
  );

  const opportunity = opportunist(kraken, kucoin)

  t.not(opportunity, {
    buy: 0.9,
    sell: 1.0
  })
})

test('buys in kucoin and sells in kraken', t => {
  const kraken = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(1.1)],
        sellWall: [new Order(1.0)]
      }
    )
  );

  const kucoin = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(0.9)],
        sellWall: [new Order(1.0)]
      }
    )
  );

  const opportunity = opportunist(kraken, kucoin)

  t.not(opportunity, null)
})

test('should spot opportunity with fees', t => {
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

  t.not(opportunity, null)
})



