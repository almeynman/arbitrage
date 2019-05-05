const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const { serialize, deserialize, topics } = require('arbitrage-lib')
const { mockPubSub } = require('./mock')

test('on exchange-tick event emits exchange-symbol-tick event for each symbol', async t => {
  const exchangeId = 'kraken'
  const sample = getSample()
  await sample.program.exchangeTickProcessor({ data: serialize({ exchangeId }) })

  t.is(sample.mocks.topic.publish.callCount, sample.mocks.symbols.length)
  sample.mocks.symbols.forEach((symbol, i) => {
    t.deepEqual(sample.mocks.topic.publish.getCall(i).args, [serialize({ exchangeId, symbol })])
  })
})

function getSample() {
  const {PubSubMock, pubsubMock, topicMock} = mockPubSub()

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
