import OpportunityRepository from 'implementation/opportunity-repository'
import { DynamoDB } from 'aws-sdk'
import Assessment from 'core/assessment'

export default class DynamoDBOpportunityRepository implements OpportunityRepository {
  constructor(
    private docClient: DynamoDB.DocumentClient
  ) {}

  async save(assessment: Assessment): Promise<void> {
    this.docClient.put({
      TableName: process.env.OPPORTUNITY_TABLE,
      Item: assessment
    })
  }
}
