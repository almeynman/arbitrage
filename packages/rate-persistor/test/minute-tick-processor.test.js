const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const tools = require('@google-cloud/nodejs-repo-tools')
const { serialize, topics } = require('arbitrage-lib')

function getSample() {
  const topicMock = {
    publish: sinon.stub().returns(Promise.resolve())
  }
  const pubsubMock = {
    topic: sinon.stub().returns(topicMock),
  }
  const PubSubMock = sinon.stub().returns(pubsubMock)

  const exchanges = ['kraken', 'kucoin', 'bitfinex']
  return {
    program: proxyquire('../src/minute-tick-processor', {
      '@google-cloud/pubsub': { PubSub: PubSubMock },
      'arbitrage-lib': { exchanges, serialize, topics }
    }),
    mocks: {
      PubSub: PubSubMock,
      pubsub: pubsubMock,
      topic: topicMock,
      exchanges,
    },
  }
}

test.beforeEach(tools.stubConsole)
test.afterEach(tools.restoreConsole)

test('on minute-tick event emits exchange-tick event for each exchange', t => {
  const sample = getSample()
  sample.program.minuteTickProcessor()

  t.is(sample.mocks.topic.publish.callCount, sample.mocks.exchanges.length)
  sample.mocks.exchanges.forEach((exchange, i) => {
    t.deepEqual(sample.mocks.topic.publish.getCall(i).args, [serialize({ exchange })])
  })
})
