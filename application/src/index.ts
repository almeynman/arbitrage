import DynamoDBOpportunityRepository from './dynamodb-opportunity-repository'
import AWS from 'aws-sdk'
import ccxt from 'ccxt'
import { Opportunist } from 'core'
import { CCXTExchangeClient, ArbitrageCoordination } from 'implementation'
import combineIntoPairs from './combine-into-pairs'
import findCommonSymbols from './find-common-symbols'

export type SendMessageToNextQueue = (message: string) => Promise<any>
export interface Params {
  message: string
  sendMessageToNextQueue?: SendMessageToNextQueue
  config?: {
    dynamoDb: {
      endpoint?: string
      tableName?: string
    }
  }
}

export const sendExchangePairs = async ({ sendMessageToNextQueue }: Params) => {
  console.log('Combining exchanges in pairs for assessment')
  let pairs = combineIntoPairs(ccxt.exchanges)
  pairs.forEach(exchanges => sendMessageToNextQueue(JSON.stringify({ exchanges })))
  console.log('Done combining exchanges in pairs for assessment')
}

export const dispatchWithCommonSymbols = async ({ message, sendMessageToNextQueue }: Params) => {
  console.log('Dispatching exchange common symbols for assessment')
  const { exchanges } = JSON.parse(message)
  const symbols = await findCommonSymbols(exchanges)
  await Promise.all(
    symbols.map(
      symbol => sendMessageToNextQueue(JSON.stringify({ symbol, exchanges }))
    )
  );
  console.log('Done dispatching exchange common symbols')
}

export const assess = async ({ message, config: { dynamoDb } }: Params) => {
  console.log('Starting arbitrage assessment')
  const { symbol, exchanges } = JSON.parse(message)
  const exchangeClient = new CCXTExchangeClient(ccxt)
  const opportunityRepository = new DynamoDBOpportunityRepository(new AWS.DynamoDB.DocumentClient({endpoint: dynamoDb.endpoint}), dynamoDb.tableName)

  const coordination = new ArbitrageCoordination(
    exchangeClient,
    new Opportunist(),
    opportunityRepository,
    exchanges.map((name: string) => ({
      name,
      fees: {
        taker: 0.26
      }
    })),
    symbol
  )

  await coordination.arbitrate()

  console.log('Done with arbitrage assessment')
}
