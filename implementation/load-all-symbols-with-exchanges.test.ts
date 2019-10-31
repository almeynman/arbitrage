import loadAllSymbolsWithExchanges from './load-all-symbols-with-exchanges'
import { AnExchange } from './fixtures'

test('constructs list of symbols from all exchanges', async () => {
  const result = await loadAllSymbolsWithExchanges()
  console.log(JSON.stringify(result, null, 4))

  expect(result).toEqual({
    'BTC/USD': ['kraken', 'kucoin'],
    'BTC/EUR': ['kraken', 'kucoin', 'coinex'],
  })
});
