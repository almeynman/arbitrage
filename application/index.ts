import DynamoDBOpportunityRepository from './dynamodb-opportunity-repository'
import AWS from 'aws-sdk'
import ccxt from 'ccxt'
import { Opportunist } from 'core'
import { CCXTExchangeClient, ArbitrageCoordination } from 'implementation'
import parseEvent from './parse-event'
import { SNSEvent } from 'aws-lambda'
import combineIntoPairs from './combine-into-pairs'
import findCommonSymbols from './find-common-symbols'

var sns = new AWS.SNS();

export const sendExchangePairs = () => {
  console.log('Combining exchanges in pairs for assessment')

  let pairs = combineIntoPairs(ccxt.exchanges)
  pairs.forEach(exchanges => {
    sns.publish({
      Message: JSON.stringify({ exchanges }),
      TopicArn: process.env.DISPATCH_WITH_COMMON_SYMBOLS_TOPIC
    }, (err, data) => {
      if (err) console.log(err)
      if (data) console.log(data)
    })
  })

  console.log('Done combining exchanges in pairs for assessment')
}

export const dispatchWithCommonSymbols = async (event: SNSEvent) => {
  console.log('Dispatching exchange common symbols for assessment')

  const { exchanges } = parseEvent(event)
  const symbols = await findCommonSymbols(exchanges)
  await Promise.all(symbols.map(symbol =>
    sns.publish({
      Message: JSON.stringify({ symbol, exchanges }),
      TopicArn: process.env.ASSESS_ARBITRAGE_OPPORTUNITY_TOPIC
    }).promise()
  ));

  console.log('Done dispatching exchange common symbols')
}

export const assess = async (event: SNSEvent) => {
  console.log('Starting arbitrage assessment')

  const { symbol, exchanges } = parseEvent(event)
  const exchangeClient = new CCXTExchangeClient(ccxt)
  const opportunityRepository = new DynamoDBOpportunityRepository(new AWS.DynamoDB.DocumentClient())

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
