import defaultCcxt, { Exchange, Market } from 'ccxt'

export default async (ccxt: any = defaultCcxt) => {
  const promises = ccxt.exchanges.map((id: string) => fetchAllSymbols(ccxt, id))
  const rawExchanges = await Promise.all(promises)
  const exchanges = rawExchanges.filter(exchange => exchange)
  return exchanges
}

async function fetchAllSymbols(ccxt: any, id: string) {
  try {
    const exchange = new ccxt[id]();
    if (exchange.hasPublicAPI) {
      await exchange.loadMarkets()
      const markets = Object.values(exchange.markets).filter((market: Market) => market.active)
      const symbols = markets.map((market: Market) => market.symbol)
      return symbols.reduce((acc, symbol) => ({
        ...acc, [symbol]: id
      }), {})
    }
  } catch (e) {
    return undefined
  }
}

function convertMarketsToSymbols(markets: any[]) {
  return markets.reduce((acc, { id, symbols}) => {
    const newAcc = { ...acc }
    symbols.forEach((symbol: string) => {
      if (newAcc[symbol]) {
        newAcc[symbol] = [ ...newAcc[symbol], id ]
        return
      }
      newAcc[symbol] = [ id ]
    })
    return newAcc
  }, {})
}
