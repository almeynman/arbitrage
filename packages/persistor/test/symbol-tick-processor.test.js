const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const { serialize, removeUndefined } = require('arbitrage-lib')
const { mockPubSub, mockFirestore } = require('./mock')
const { testTicker, testOrderBook } = require('./fixtures')

const exchangeIds = ['kraken', 'bitfinex']
const symbol = 'BTC/USD'
const data = { exchangeIds, symbol }
const event = { data: serialize(data) }

test('fetches ticker for symbol for each exchange', async t => {
  const sample = getSample()
  await sample.program.symbolTickProcessor(event)

  exchangeIds.forEach(exchangeId => {
    t.deepEqual(sample.mocks.exchanges[exchangeId].fetchTicker.firstCall.args, [symbol])
  })
})

test('fetches orderbook for symbol for each exchange', async t => {
  const sample = getSample()
  await sample.program.symbolTickProcessor(event)

  exchangeIds.forEach(exchangeId => {
    t.deepEqual(sample.mocks.exchanges[exchangeId].fetchL2OrderBook.firstCall.args, [symbol])
  })
})

test('persists ticker and orderbook', async t => {
  const timestamp = 1557084602260
  sinon.useFakeTimers(timestamp)
  const sample = getSample()
  await sample.program.symbolTickProcessor(event)

  t.deepEqual(sample.mocks.collection.add.firstCall.args, [
    {
      symbol,
      kraken: {
        ticker: removeUndefined(testTicker),
        orderBook: removeUndefined(testOrderBook),
      },
      bitfinex: {
        ticker: removeUndefined(testTicker),
        orderBook: removeUndefined(testOrderBook),
      },
      timestamp,
    },
  ])
})

function getSample() {
  const { PubSubMock, pubsubMock, topicMock } = mockPubSub()
  const { FirestoreMock, firestoreMock, collectionMock } = mockFirestore()
  const exchangeMocks = exchangeIds.reduce(
    (acc, exchangeId) => ({
      ...acc,
      [exchangeId]: {
        id: exchangeId,
        fetchTicker: sinon.stub().returns(Promise.resolve(testTicker)),
        fetchL2OrderBook: sinon.stub().returns(Promise.resolve(testOrderBook)),
      },
    }),
    {},
  )
  const ccxtMock = exchangeIds.reduce(
    (acc, exchangeId) => ({
      ...acc,
      [exchangeId]: sinon.stub().returns(exchangeMocks[exchangeId]),
    }),
    {},
  )

  return {
    program: proxyquire('../src/symbol-tick-processor', {
      '@google-cloud/pubsub': { PubSub: PubSubMock },
      '@google-cloud/firestore': FirestoreMock,
      ccxt: ccxtMock,
    }),
    mocks: {
      PubSub: PubSubMock,
      pubsub: pubsubMock,
      topic: topicMock,
      Firestore: FirestoreMock,
      firestore: firestoreMock,
      collection: collectionMock,
      ccxt: ccxtMock,
      exchanges: exchangeMocks,
    },
  }
}
