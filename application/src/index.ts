import DynamoDBOpportunityRepository from './dynamodb-opportunity-repository'
import AWS from 'aws-sdk'
import ccxt from 'ccxt'
import { Opportunist } from 'core'
import { CCXTExchangeClient, ArbitrageCoordination } from 'implementation'
import parseEvent from './parse-event'
import { SNSEvent } from 'aws-lambda'
import { ExchangeArgs } from 'implementation/arbitrage-coordination';
import combineIntoPairs from './combine-into-pairs'
import findCommonSymbols, { ExchangePair } from './find-common-symbols'

var sns = new AWS.SNS();

export const sendExchangePairs = () => {
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
}

exports.dispatchWithCommonSymbols = async (event: SNSEvent) => {
  const { exchanges } = parseEvent(event)
  const symbols = await findCommonSymbols(exchanges)
  await Promise.all(symbols.map(symbol =>
    sns.publish({
      Message: JSON.stringify({ symbol, exchanges }), /* required */
      TopicArn: process.env.ASSESS_ARBITRAGE_OPPORTUNITY_TOPIC
    }).promise()
  ));
}

exports.assess = async (event: SNSEvent) => {
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
  console.log('done')
}
