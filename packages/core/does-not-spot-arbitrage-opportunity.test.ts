import test from 'ava'
import opportunist from './opportunist'
import Exchange from './exchange'
import ExchangeFees from './exchange-fees'
import OrderBook from './order-book'
import Order from './order'

test('should not spot arbitrage opportunity', t => {
  const kraken = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(1.0)],
        sellWall: [new Order(1.0)]
      }
    )
  );

  const kucoin = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(1.0)],
        sellWall: [new Order(1.0)]

      }
    )
  );


  const opportunity = opportunist(kraken, kucoin)

  t.is(opportunity, null)
})

test('should not spot opportunity with fees', t => {
  const kraken = new Exchange(
    new OrderBook(
      {
        buyWall: [new Order(1.1)],
        sellWall: [new Order(1.0)]
      }
    ),
    new ExchangeFees(
      0.06,
      0.05,
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
      0.1,
      0.03,
    )
  );

  const opportunity = opportunist(kraken, kucoin)

  t.is(opportunity, null)
})
