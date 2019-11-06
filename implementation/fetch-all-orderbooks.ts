import ccxt, { Market, Exchange } from 'ccxt'
import getDynamoDbAssessmentRepository from './dynamodb-assessment-repository'
import { DynamoDB } from 'aws-sdk'

const documentClient = new DynamoDB.DocumentClient({ endpoint: 'http://localhost:4569' })
const assessmentRepository = getDynamoDbAssessmentRepository(documentClient, 'opportunity')

// async function fetchAllOrderbooks(blacklistExchanges: string[]) {
//   console.time('All orderbooks')
//   const promises = ccxt.exchanges
//     .filter((id: string) => !blacklistExchanges.includes(id))
//     .map((id: string) => fetchMarkets(ccxt, id))
//   const rawExchanges = await Promise.all(promises)
//   console.timeEnd('All orderbooks')
//   // const exchanges = rawExchanges.filter(exchange => exchange)
//   // return exchanges
// }
export default async function fetchMarkets(ccxt: any, id: string) {
  try {
    const exchange = new ccxt[id]();
    if (exchange.hasPublicAPI) {
      // for each exchange
      await exchange.loadMarkets()
      const symbols = Object.values(exchange.markets).filter((market: Market) => market.active).map((market: Market) => market.symbol)
      const promises = symbols.map((symbol: string) => fetchAndSaveOrderbook(exchange, symbol))
      await Promise.all(promises)
    }
  } catch (e) {
    console.error(e.message)
  }
}

async function fetchAndSaveOrderbook(exchange: Exchange, symbol: string) {
  const orderbook: any = await exchange.fetchOrderBook(symbol)
  await assessmentRepository.save(orderbook)
}
