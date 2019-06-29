import * as sinon from 'sinon'
import Assessment from 'core/assessment'
import DynamoDBOpportunityRepository from './dynamodb-opportunity-repository'
import { DynamoDB } from 'aws-sdk';
import * as chai from 'chai'
import sinonChai from 'sinon-chai'

const expect = chai.expect;
chai.use(sinonChai)

test('puts an opportunity to a document client', async () => {
  const docClient = sinon.createStubInstance(DynamoDB.DocumentClient)
  const opportunityRepository = new DynamoDBOpportunityRepository(docClient as any)
  const opportunity = new Assessment({
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
  opportunityRepository.save(opportunity)
  expect(docClient.put).to.have.been.called
});
