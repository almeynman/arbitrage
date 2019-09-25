import findCommonSymbols, { ExchangePair } from './find-common-symbols'

// TODO: mock ccxt calls to exchanges
test('combines into pairs', async () => {
  const exchanges: ExchangePair = ['kraken', 'kucoin']
  const symbols = await findCommonSymbols(exchanges)
  expect(symbols).toEqual([
    "ADA/BTC",
    "ATOM/BTC",
    "ATOM/ETH",
    "BCH/BTC",
    "DASH/BTC",
    "EOS/BTC",
    "EOS/ETH",
    "ETC/BTC",
    "ETC/ETH",
    "ETH/BTC",
    "ETH/DAI",
    "LTC/BTC",
    "QTUM/BTC",
    "XLM/BTC",
    "XMR/BTC",
    "XRP/BTC",
    "XTZ/BTC",
    "ZEC/BTC"
])
});
