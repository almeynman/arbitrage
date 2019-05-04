const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const tools = require('@google-cloud/nodejs-repo-tools')
const { serialize } = require('arbitrage-lib')

function getSample() {
  const topicMock = {
    publish: sinon.stub().returns(Promise.resolve()),
  }
  const pubsubMock = {
    topic: sinon.stub().returns(topicMock),
  }
  const PubSubMock = sinon.stub().returns(pubsubMock)

  return {
    program: proxyquire('../src/exchange-symbol-tick-processor', {
      '@google-cloud/pubsub': { PubSub: PubSubMock },
    }),
    mocks: {
      PubSub: PubSubMock,
      pubsub: pubsubMock,
      topic: topicMock,
    },
  }
}

test.beforeEach(tools.stubConsole)
test.afterEach(tools.restoreConsole)

test('subscribes to topic', t => {
  const exchange = 'kraken'
  const symbol = 'BTC/USD'
  const data = { exchange, symbol }
  const event = {
    data: serialize(data)
  }

  const sample = getSample()
  sample.program.exchangeSymbolTickProcessor(event)

  t.deepEqual(console.log.firstCall.args, [exchange])
  t.deepEqual(console.log.secondCall.args, [symbol])
})
