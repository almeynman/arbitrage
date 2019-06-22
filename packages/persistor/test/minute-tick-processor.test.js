const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const { serialize, topics } = require('arbitrage-lib')
const { mockPubSub } = require('./mock')

const exchangeIds = ['kraken', 'bitfinex']
const symbols = ['BTC/USD', 'ETH/BTC', 'LTC/BTC']

test.skip('publishes symbol-tick event for each symbol', async () => {
  const sample = getSample()
  await sample.program.minuteTickProcessor()

  expect(sample.mocks.topic.publish.callCount).toBe(symbols.length)
  symbols.forEach((symbol, i) => {
    expect(sample.mocks.topic.publish.getCall(i).args).toEqual([serialize({ exchangeIds, symbol })])
  })
})

function getSample() {
  const {PubSubMock, pubsubMock, topicMock} = mockPubSub()

  return {
    program: proxyquire('../src/minute-tick-processor', {
      '@google-cloud/pubsub': { PubSub: PubSubMock },
      'arbitrage-lib': { exchangeIds, serialize, topics, symbols }
    }),
    mocks: {
      PubSub: PubSubMock,
      pubsub: pubsubMock,
      topic: topicMock,
    },
  }
}
