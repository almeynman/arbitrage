const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const { serialize, removeUndefined } = require('arbitrage-lib')
const { mockPubSub, mockFirestore } = require('./mock')
const { testTicker, testOrderBook } = require('./fixtures')

const exchangeId = 'kraken'
const symbol = 'BTC/USD'
const data = { exchangeId, symbol }
const event = { data: serialize(data) }

test('fetches ticker for symbol at exchange', async t => {
  const sample = getSample()
  await sample.program.exchangeSymbolTickProcessor(event)

  t.deepEqual(sample.mocks.exchange.fetchTicker.firstCall.args, [symbol])
})

test('fetches orderbook for symbol at exchange', async t => {
  const sample = getSample()
  await sample.program.exchangeSymbolTickProcessor(event)

  t.deepEqual(sample.mocks.exchange.fetchOrderBook.firstCall.args, [symbol])
})

test('persists ticker and orderbook info', async t => {
  const timestamp = 1557084602260
  sinon.useFakeTimers(timestamp)
  const sample = getSample()
  await sample.program.exchangeSymbolTickProcessor(event)

  t.deepEqual(sample.mocks.collection.add.firstCall.args, [
    {
      exchangeId,
      symbol,
      ticker: removeUndefined(testTicker),
      orderBook: removeUndefined(testOrderBook),
      timestamp,
    },
  ])
})

function getSample() {
  const { PubSubMock, pubsubMock, topicMock } = mockPubSub()
  const { FirestoreMock, firestoreMock, collectionMock } = mockFirestore()
  const exchangeMock = {
    fetchTicker: sinon.stub().returns(Promise.resolve(testTicker)),
    fetchOrderBook: sinon.stub().returns(Promise.resolve(testOrderBook)),
  }
  const ccxtMock = { [exchangeId]: sinon.stub().returns(exchangeMock) }

  return {
    program: proxyquire('../src/exchange-symbol-tick-processor', {
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
      exchange: exchangeMock,
    },
  }
}
