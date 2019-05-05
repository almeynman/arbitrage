const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const { serialize, topics } = require('arbitrage-lib')
const { mockPubSub } = require('./mock')

test('publishes exchange-tick event for each exchange', async t => {
  const sample = getSample()
  await sample.program.minuteTickProcessor()

  t.is(sample.mocks.topic.publish.callCount, sample.mocks.exchangeIds.length)
  sample.mocks.exchangeIds.forEach((exchangeId, i) => {
    t.deepEqual(sample.mocks.topic.publish.getCall(i).args, [serialize({ exchangeId })])
  })
})

function getSample() {
  const {PubSubMock, pubsubMock, topicMock} = mockPubSub()

  const exchangeIds = ['kraken', 'kucoin', 'bitfinex']
  return {
    program: proxyquire('../src/minute-tick-processor', {
      '@google-cloud/pubsub': { PubSub: PubSubMock },
      'arbitrage-lib': { exchangeIds, serialize, topics }
    }),
    mocks: {
      PubSub: PubSubMock,
      pubsub: pubsubMock,
      topic: topicMock,
      exchangeIds,
    },
  }
}
