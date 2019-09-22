import AWS from 'aws-sdk'
import { Consumer } from 'sqs-consumer'
import {
  sendExchangePairs,
  dispatchWithCommonSymbols,
  assess,
  SendMessageToNextQueue,
  Params,
} from './index'

AWS.config.update({
  accessKeyId: 'something',
  secretAccessKey: 'something',
  region: 'us-east-1',
  logger: process.stdout,
})

const sqs = new AWS.SQS()

const SEND_EXCHANGE_PAIRS_QUEUE_URL = 'http://localhost:4576/queue/send-exchange-pairs'
const DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL = 'http://localhost:4576/queue/dispatch-with-common-symbols'
const ASSESS_QUEUE_URL = 'http://localhost:4576/queue/assess'

interface ConsumeSqsQueueParams {
  sqs: AWS.SQS,
  queueUrl: string,
  handleMessage: (params: Params) => Promise<void>,
  nextQueueUrl?: string
}

consumeSqsQueue({
  sqs,
  queueUrl: SEND_EXCHANGE_PAIRS_QUEUE_URL,
  handleMessage: sendExchangePairs,
  nextQueueUrl: DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL
})
consumeSqsQueue({
  sqs,
  queueUrl: DISPATCH_WITH_COMMON_SYMBOLS_QUEUE_URL,
  handleMessage: dispatchWithCommonSymbols,
  nextQueueUrl: ASSESS_QUEUE_URL
})
consumeSqsQueue({
  sqs,
  queueUrl: ASSESS_QUEUE_URL,
  handleMessage: assess
})

function consumeSqsQueue({ sqs, queueUrl, handleMessage, nextQueueUrl }: ConsumeSqsQueueParams) {
  const sendMessage = nextQueueUrl ? (message: string) => sqs.sendMessage({
    QueueUrl: nextQueueUrl,
    MessageBody: message
  }).promise() : null
  const app = Consumer.create({
    queueUrl,
    handleMessage: (message: AWS.SQS.Types.Message) => handleMessage({ message: message.Body, sendMessageToNextQueue: sendMessage }),
    sqs
  })

  app.on('error', (err) => {
    console.error(err.message);
  });

  app.on('processing_error', (err) => {
    console.error(err.message);
  });

  app.on('timeout_error', (err) => {
    console.error(err.message);
  });

  app.start();
}
