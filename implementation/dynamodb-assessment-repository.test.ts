import Assessment from 'core/assessment'
import getDynamoDbAssessmentRepository from './dynamodb-assessment-repository'
import * as AWS from 'aws-sdk';
import * as AWSMock from "aws-sdk-mock";
import * as chai from 'chai'
import sinonChai from 'sinon-chai'

const expect = chai.expect;
chai.use(sinonChai)

test('puts an assessment to a document client', async () => {
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (_: any, callback: Function) => callback(null, null))
  const docClient = new AWS.DynamoDB.DocumentClient()

  const assessmentRepository = getDynamoDbAssessmentRepository(docClient, 'assessment')
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
  await assessmentRepository.save(assessment)
  expect(docClient.put).to.have.been.called
});
