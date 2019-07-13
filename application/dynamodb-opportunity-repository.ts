import OpportunityRepository from 'implementation/opportunity-repository'
import { DynamoDB } from 'aws-sdk'
import Assessment from 'core/assessment'
import uuidv4 from 'uuid/v4'

export default class DynamoDBOpportunityRepository implements OpportunityRepository {
  constructor(
    private docClient: DynamoDB.DocumentClient
  ) {}

  async save(assessment: Assessment): Promise<void> {
    const item = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...assessment,
    }

    await this.docClient.put({
      TableName: process.env.OPPORTUNITY_TABLE,
      Item: item
    })
  }
}
