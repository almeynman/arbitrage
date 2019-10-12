import AWS from 'aws-sdk'
import { Opportunist } from 'core'
import { getDynamoDbOpportunityRepository, getCcxtExchangeClient, ArbitrageCoordination, getExchangePairs, findCommonSymbols } from 'implementation'
import { Config } from './config'

export type SendMessageToNextQueue = (message: string) => Promise<any>
export interface Params {
  message: string
  sendMessageToNextQueue?: SendMessageToNextQueue
  config?: Config
}

export const sendExchangePairs = async ({ sendMessageToNextQueue }: Params) => {
  let pairs = getExchangePairs()
  console.log(`Sending ${pairs.length} exchange pairs`)
  pairs.forEach(exchanges => sendMessageToNextQueue(JSON.stringify({ exchanges })))
}

export const dispatchWithCommonSymbols = async ({ message, sendMessageToNextQueue }: Params) => {
  const { exchanges } = JSON.parse(message)
  const symbols = await findCommonSymbols(exchanges)
  console.log(`Sending ${symbols.length} symbols for exchange pair ${exchanges}`)
  await Promise.all(
    symbols.map(
      symbol => sendMessageToNextQueue(JSON.stringify({ symbol, exchanges }))
    )
  );
}

export const assess = async ({ message, config: { dynamoDb } }: Params) => {
  const { symbol, exchanges } = JSON.parse(message)
  const exchangeClient = getCcxtExchangeClient()
  const documentClient = dynamoDb.endpoint
    ? new AWS.DynamoDB.DocumentClient({ endpoint: dynamoDb.endpoint }) : new AWS.DynamoDB.DocumentClient()
  const opportunityRepository = getDynamoDbOpportunityRepository(documentClient, dynamoDb.opportunityTableName)

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
}
