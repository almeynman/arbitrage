import DynamoDBOpportunityRepository from './dynamodb-opportunity-repository'
import AWS from 'aws-sdk'
import Assessment from 'core/assessment';

export const helloWorld = async (event: any) => {
    const opportunityRepository = new DynamoDBOpportunityRepository(new AWS.DynamoDB.DocumentClient())
    const assessment = new Assessment({
        symbol: 'EUR/BTC',
        coefficient: 1.1,
        buy: {
          exchange: 'exchange1',
          price: 8000,
          expectedFee: 0.01
        },
        sell: {
          exchange: 'exchange2',
          price: 8100,
          expectedFee: 0.02
        },
      })
    await opportunityRepository.save(assessment)
}
