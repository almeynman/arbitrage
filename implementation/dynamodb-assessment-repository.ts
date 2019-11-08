import { DynamoDB } from 'aws-sdk'
import Assessment from 'core/assessment'
import uuidv4 from 'uuid/v4'
import AssessmentRepository from './assessment-repository'

export default (docClient: DynamoDB.DocumentClient, tableName: string): AssessmentRepository => ({
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
