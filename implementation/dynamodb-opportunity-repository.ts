import OpportunityRepository from './opportunity-repository'
import { DynamoDB } from 'aws-sdk'
import Assessment from 'core/assessment'
import uuidv4 from 'uuid/v4'

export default (docClient: DynamoDB.DocumentClient, tableName: string): OpportunityRepository => ({
  async save(assessment: Assessment): Promise<void> {
    const item = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...assessment,
    }

    await docClient.put({
      TableName: tableName,
      Item: item
    }).promise().catch((error) => {
      console.error(JSON.stringify(error, null, 4))
    })
  }  
})