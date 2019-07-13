import DynamoDBOpportunityRepository from './dynamodb-opportunity-repository'
import AWS from 'aws-sdk'
import * as exchangeFees from 'implementation/exchanges-config.json'
import ccxt from 'ccxt'
import { Opportunist } from 'core'
import { CCXTExchangeClient, ArbitrageCoordination } from 'implementation'

export const opportunist = async (event: any) => {
  const symbol = 'DASH/BTC'
  const krakenExchangeName = 'kraken'
  const kucoinExchangeName = 'kucoin'
  const exchangeClient = new CCXTExchangeClient(ccxt)
  const opportunityRepository = new DynamoDBOpportunityRepository(new AWS.DynamoDB.DocumentClient())

  const coordination = new ArbitrageCoordination(
    exchangeClient,
    new Opportunist(),
    opportunityRepository,
    [
      exchangeFees.exchanges[krakenExchangeName],
      exchangeFees.exchanges[kucoinExchangeName],
    ],
    symbol
  )

  await coordination.arbitrate()
  console.log('done')
}
