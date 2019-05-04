const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const tools = require('@google-cloud/nodejs-repo-tools')
const { serialize, deserialize, topics } = require('arbitrage-lib')

function getSample() {
  const topicMock = {
    publish: sinon.stub().returns(Promise.resolve()),
  }
  const pubsubMock = {
    topic: sinon.stub().returns(topicMock),
  }
  const PubSubMock = sinon.stub().returns(pubsubMock)

  const symbols = ['BTC/USD', 'USD/BTC', 'ETH/BTC']
  return {
    program: proxyquire('../src/exchange-tick-processor', {
      '@google-cloud/pubsub': { PubSub: PubSubMock },
      'arbitrage-lib': { symbols, serialize, deserialize, topics },
    }),
    mocks: {
      PubSub: PubSubMock,
      pubsub: pubsubMock,
      topic: topicMock,
      symbols,
    },
  }
}

test.beforeEach(tools.stubConsole)
test.afterEach(tools.restoreConsole)

test('on exchange-tick event emits exchange-symbol-tick event for each symbol', t => {
  const exchange = 'kraken'
  const sample = getSample()
  sample.program.exchangeTickProcessor({ data: serialize({ exchange }) })

  t.is(sample.mocks.topic.publish.callCount, sample.mocks.symbols.length)
  sample.mocks.symbols.forEach((symbol, i) => {
    t.deepEqual(sample.mocks.topic.publish.getCall(i).args, [serialize({ exchange, symbol })])
  })
})
