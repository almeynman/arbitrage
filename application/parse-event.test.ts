import parseEvent from './parse-event'

test('parses AWS SNS Event correctly', async () => {
  const event = {
    "Records": [
      {
        "EventSource": "aws:sns",
        "EventVersion": "1.0",
        "EventSubscriptionArn": "arn:aws:sns:eu-west-1:970227894311:assess-arbitrage-opportunity:8c31c9e1-cc58-43c3-b9d2-aac4ae8e2aed",
        "Sns": {
          "Type": "Notification",
          "MessageId": "9c2359f0-f0e9-55ba-8873-0c53101a7421",
          "TopicArn": "arn:aws:sns:eu-west-1:970227894311:assess-arbitrage-opportunity",
          "Subject": '',
          "Message": "{\"symbol\":\"EOS/ETH\",\"exchanges\":[\"kraken\",\"kucoin\"]}",
          "Timestamp": "2019-07-13T13:37:55.323Z",
          "SignatureVersion": "1",
          "Signature": "pf4BO6qAP+xji8tkJxjEQc6H5UyYyFbHOSDKKr+XZT9TJ3EUfD/Q011OgpYzMU94tSPd8HVdGAafqd45F+knUY/OhKKGZxsWAwd45X5YqfDWBWxH8hkzREMxM8WTjEQF+1muigm8Kl69uNDs+pS9spG/tlmqbF+HODOSMXGbVFJhPbjV0cOST3wASUvvxhDJNVOaIL7GpAhniicu8BU3ZJNM3kjeOOSC9xzUB4H79JwEsWNXDvgWs+rYV4ITk+JZVIwj/dsR7YUvLBtUlnZGCOiSQcbejGP8hXpPa3U1J6E9PCYUCqX+nnQ0PtpdUCdVZoftMBCQC3UsF++ApzLjxg==",
          "SigningCertUrl": "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-6aad65c2f9911b05cd53efda11f913f9.pem",
          "UnsubscribeUrl": "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:970227894311:assess-arbitrage-opportunity:8c31c9e1-cc58-43c3-b9d2-aac4ae8e2aed",
          "MessageAttributes": {}
        }
      }
    ]
  }

  const parsedEvent = parseEvent(event)

  expect(parsedEvent).toEqual({
    symbol: 'EOS/ETH',
    exchanges: ['kraken', 'kucoin']
  })
});
