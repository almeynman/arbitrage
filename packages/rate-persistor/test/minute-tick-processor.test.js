'use strict'

const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const tools = require('@google-cloud/nodejs-repo-tools')
const { serialize, exchanges } = require('arbitrage-lib')

function getSample() {
  const topicMock = {
    publish: sinon.stub().returns(Promise.resolve())
  }
  const pubsubMock = {
    topic: sinon.stub().returns(topicMock),
  }
  const PubSubMock = sinon.stub().returns(pubsubMock)

  return {
    program: proxyquire('../src/minute-tick-processor', {
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

test('on minute-tick event emits fetch-rates-for-exchange event for each exchange', t => {
  const sample = getSample()
  sample.program.minuteTickProcessor()

  t.is(sample.mocks.topic.publish.callCount, exchanges.length)
  exchanges.forEach((exchange, i) => {
    console.log(serialize({ exchange }))
    t.deepEqual(sample.mocks.topic.publish.getCall(i).args, [serialize({ exchange })])
  })
})