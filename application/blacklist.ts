const blacklist = [
  { exchange: 'bibox', error: "bibox fetchCurrencies is an authenticated endpoint, therefore it requires 'apiKey' and 'secret' credentials. If you don't need currency details, set exchange.has['fetchCurrencies'] = false before calling its methods." },
  { exchange: 'cointiger', error: "cointiger requires `apiKey` credential" },
  { exchange: 'xbtce', error: "xbtce requires apiKey for all requests, their public API is always busy" },
  { exchange: 'flowbtc', error: `flowbtc POST https://publicapi.flowbtc.com.br/v1/GetProductPairs 403 Forbidden {"message":"Missing Authentication Token"} (possible reasons: invalid API keys, bad or old nonce, exchange is down or offline, on maintenance, DDoS protection, rate-limiting)` },
  { exchange: 'coinegg', error: "coinegg GET https://trade.coinegg.com/web/symbol/ticker?right_coin=btc 418 I'm a Teapot <!DOCTYPE html> ...Access denied" },
  { exchange: 'btctradeim', error: "btctradeim GET https://api.btctrade.im/coin/symbol/ticker?right_coin=btc 500 Internal Server Error  (possible reasons: invalid API keys, bad or old nonce, exchange is down or offline, on maintenance, DDoS protection, rate-limiting)" },
  { exchange: 'coolcoin', error: "coolcoin GET https://www.coolcoin.com/coin/symbol/ticker?right_coin=btc 500 Internal Server Error  (possible reasons: invalid API keys, bad or old nonce, exchange is down or offline, on maintenance, DDoS protection, rate-limiting)" },
  { exchange: 'coinmarketcap', error: "Fetching order books is not supported by the API of coinmarketca" },
  { exchange: 'bcex', error: "bcex GET https://www.bcex.top/Api_Market/getPriceList 404 Not Found <!doctype html>" },
  { exchange: 'stronghold', error: `stronghold {"requestId":"f708f213-e631-4513-8ff8-3797bd4777fb","timestamp":"2019-10-16T05:49:31.14391Z","success":false,"statusCode":401}` },
  { exchange: 'theocean', error: " Required dependencies missing: npm i web3 ethereumjs-util ethereumjs-abi bignumber.js --no-save" },
  { exchange: 'coinbase', error: "exchangeInstance.fetchOrderBook is not a function" },
]

const blacklistExchanges = blacklist.map(b => b.exchange)

export default blacklistExchanges
