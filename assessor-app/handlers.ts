import AWS from 'aws-sdk'
import {
  arbitrate
} from 'business-logic'
import {
  findCommonSymbols,
  getCcxtExchangeClient,
  getDynamoDbAssessmentRepository,
  getExchangePairs
} from 'adapters'
import blacklistExchanges from './blacklist'
import { Config } from './config'

export type SendMessageToNextQueue = ((message: string) => Promise<void>) | undefined
export interface Params {
  message: string
  sendMessageToNextQueue: SendMessageToNextQueue
  config: Config
}

export const sendExchangePairs = async ({ sendMessageToNextQueue }: Params): Promise<void> => {
  const pairs = getExchangePairs().filter(([exchange1, exchange2]) =>
    !blacklistExchanges.includes(exchange1) && !blacklistExchanges.includes(exchange2)
  )
  console.log(`Sending ${pairs.length} exchange pairs`)
  await Promise.all(pairs.map((exchanges) => sendMessageToNextQueue && sendMessageToNextQueue(JSON.stringify({ exchanges }))))
}

export const dispatchWithCommonSymbols = async ({ message, sendMessageToNextQueue }: Params): Promise<void>  => {
  const { exchanges } = JSON.parse(message)
  const symbols = await findCommonSymbols(exchanges)
  console.log(`Sending ${symbols.length} symbols for exchange pair ${exchanges}`)
  await Promise.all(
    symbols.map(
      (symbol) => sendMessageToNextQueue && sendMessageToNextQueue(JSON.stringify({ symbol, exchanges }))
    )
  )
}

export const assess = async ({ message, config: { dynamoDb } }: Params): Promise<void>  => {
  const { symbol, exchanges } = JSON.parse(message)
  const exchangeClient = getCcxtExchangeClient()
  const documentClient = dynamoDb.endpoint
    ? new AWS.DynamoDB.DocumentClient({ endpoint: dynamoDb.endpoint }) : new AWS.DynamoDB.DocumentClient()
  const assessmentRepository = getDynamoDbAssessmentRepository(documentClient, dynamoDb.assessmentTableName)

  await arbitrate({
    exchangeClient,
    assessmentRepository,
    exchanges: exchanges.map((name: string) => ({
      name,
      fees: {
        taker: 0.26
      }
    })),
    symbol
  })
}
