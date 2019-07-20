import ccxt, { Exchange } from 'ccxt'

export type ExchangePair = [string, string]

export default async function (pair: ExchangePair) {
  console.log(pair)
  const exchanges: {[key: string]: Exchange}  = {}
  // @ts-ignore
  let exchange1: Exchange = new ccxt[pair[0]]()
  await exchange1.loadMarkets()
  exchanges[pair[0]] = exchange1
  // @ts-ignore
  let exchange2: Exchange = new ccxt[pair[1]]()
  await exchange2.loadMarkets()
  exchanges[pair[1]] = exchange2
  // @ts-ignore
  let uniqueSymbols: string[] = ccxt.unique(ccxt.flatten(pair.map(id => exchanges[id].symbols)))
  let arbitrableSymbols = uniqueSymbols
    .filter(symbol => pair.filter(id => exchanges[id].symbols.indexOf(symbol) >= 0).length > 1)
    .sort((id1, id2) => (id1 > id2 ? 1 : id2 > id1 ? -1 : 0))

  return arbitrableSymbols
}
