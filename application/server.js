const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: 'something',
  secretAccessKey: 'something',
  region: 'us-east-1',
  logger: process.stdout,
})

async function main() {
  const sqs = new AWS.SQS({ endpoint: 'http://localhost:4576' })
  const { QueueUrl } = await sqs.createQueue({ QueueName: 'testing123' }).promise()
  await sqs.sendMessage({ QueueUrl, MessageBody: '{"hello":"world"}'}).promise()
  const data = await sqs.receiveMessage({ QueueUrl }).promise()
  console.log(data)
}

main()
