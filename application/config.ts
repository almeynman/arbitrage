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
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'something',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'something',
    region: process.env.AWS_REGION || 'us-east-1'
  },
  dynamoDb: {
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:4569',
    opportunityTableName: process.env.DYNAMODB_OPPORTUNITY_TABLE_NAME || 'opportunity'
  },
  sqs: {
    sendExchangePairsQueueUrl: process.env.SEND_EXCHANGE_PAIRS_QUEUE_URL || 'http://localhost:4576/queue/send-exchange-pairs',
    dispatchWithCommonSymbolsQueueUrl: process.env.DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL || 'http://localhost:4576/queue/dispatch-with-common-symbols',
    assessQueueUrl: process.env.ASSESS_QUEUE_URL || 'http://localhost:4576/queue/assess',
  }
}
export default config