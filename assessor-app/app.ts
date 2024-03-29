import AWS from "aws-sdk";
import { Consumer } from "sqs-consumer";
import config from "./config";
import {
  assess,
  dispatchWithCommonSymbols,
  Params,
  sendExchangePairs,
  SendMessageToNextQueue
} from "./handlers";

AWS.config.update(config.aws);

const sqs = new AWS.SQS();

interface ConsumeSqsQueueParams {
  sqs: AWS.SQS;
  queueUrl: string;
  handleMessage: (params: Params) => Promise<void>;
  nextQueueUrl?: string;
}

consumeSqsQueue({
  sqs,
  queueUrl: config.sqs.sendExchangePairsQueueUrl,
  handleMessage: sendExchangePairs,
  nextQueueUrl: config.sqs.dispatchWithCommonSymbolsQueueUrl
});
consumeSqsQueue({
  sqs,
  queueUrl: config.sqs.dispatchWithCommonSymbolsQueueUrl,
  handleMessage: dispatchWithCommonSymbols,
  nextQueueUrl: config.sqs.assessQueueUrl
});
consumeSqsQueue({
  sqs,
  queueUrl: config.sqs.assessQueueUrl,
  handleMessage: assess
});

function consumeSqsQueue({
  sqs,
  queueUrl,
  handleMessage,
  nextQueueUrl
}: ConsumeSqsQueueParams): void {
  const sendMessage: SendMessageToNextQueue =
    nextQueueUrl ?
    (async (message: string): Promise<void> => {
      await sqs
        .sendMessage({
          QueueUrl: nextQueueUrl,
          MessageBody: message
        })
        .promise();
    }): undefined;
  const app = Consumer.create({
    queueUrl,
    handleMessage: (message: AWS.SQS.Types.Message) =>
      handleMessage({
        message: message.Body || "",
        sendMessageToNextQueue: sendMessage,
        config
      }),
    sqs
  });

  app.on("error", err => {
    console.error(err.message);
  });

  app.on("processing_error", err => {
    console.error(err.message);
  });

  app.on("timeout_error", err => {
    console.error(err.message);
  });

  app.start();
  console.log(`setup listener to ${queueUrl}`);
}
