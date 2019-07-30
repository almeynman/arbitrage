const AWS = require('aws-sdk')
const http = require('http')

const hostname = 'localhost'
const port = 3000

AWS.config.update({
  accessKeyId: 'something',
  secretAccessKey: 'something',
  region: 'us-east-1',
  logger: process.stdout,
})

const server = http.createServer((req, res) => {
  console.log('triggered', req.url)
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(port, hostname, async () => {
  console.log(`Server running at http://${hostname}:${port}/`)

  const sns = new AWS.SNS({ endpoint: 'http://localhost:4575' })
  const topic = await sns.createTopic({ Name: 'testing123' }).promise()
  const topicArn = topic.TopicArn

  await sns
    .subscribe({
      TopicArn: topicArn,
      Protocol: 'http',
      Endpoint: 'http://localhost:3000/sns/publish',
    })
    .promise()
    .then(console.log)
    .catch(console.error)

  await sns
    .publish({
      TopicArn: topicArn,
      Message: '{"hello":"world"}',
      MessageStructure: 'json'
    })
    .promise()
    .then(console.log)
    .catch(console.error)
})
