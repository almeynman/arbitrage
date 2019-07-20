import { SNSEvent } from 'aws-lambda'

export interface Event {
  [key: string]: any,
}

export default function (event: SNSEvent): Event {
  return JSON.parse(event.Records[0].Sns.Message)
}
