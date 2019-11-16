export interface Config {
  aws: {
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
  },
  dynamoDb: {
    endpoint: string,
    assessmentTableName: string
  },
  sqs: {
    sendExchangePairsQueueUrl: string,
    dispatchWithCommonSymbolsQueueUrl: string,
    assessQueueUrl: string,
  }
}
const config: Config = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    region: process.env.AWS_REGION as string
  },
  dynamoDb: {
    endpoint: process.env.DYNAMODB_ENDPOINT  as string,
    assessmentTableName: process.env.DYNAMODB_ASSESSMENT_TABLE_NAME  as string
  },
  sqs: {
    sendExchangePairsQueueUrl: process.env.SEND_EXCHANGE_PAIRS_QUEUE_URL  as string,
    dispatchWithCommonSymbolsQueueUrl: process.env.DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL  as string,
    assessQueueUrl: process.env.ASSESS_QUEUE_URL  as string,
  }
}
export default config
