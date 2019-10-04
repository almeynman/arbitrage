export interface Config {
  aws: { 
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
  },
  dynamoDb: {
    endpoint: string,
    opportunityTableName: string
  },
  sqs: {
    sendExchangePairsQueueUrl: string,
    dispatchWithCommonSymbolsQueueUrl: string,
    assessQueueUrl: string,
  }
}
const config: Config = {
  aws: { 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  },
  dynamoDb: {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    opportunityTableName: process.env.DYNAMODB_OPPORTUNITY_TABLE_NAME
  },
  sqs: {
    sendExchangePairsQueueUrl: process.env.SEND_EXCHANGE_PAIRS_QUEUE_URL,
    dispatchWithCommonSymbolsQueueUrl: process.env.DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL,
    assessQueueUrl: process.env.ASSESS_QUEUE_URL,
  }
}
export default config
