'use strict'

const test = require('ava')
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')
const tools = require('@google-cloud/nodejs-repo-tools')
const Buffer = require('safe-buffer').Buffer

const MESSAGE = 'tick'

function getSample() {
  const topicMock = {
    publish: sinon.stub().returns(Promise.resolve()),
  }
  const pubsubMock = {
    topic: sinon.stub().returns(topicMock),
  }
  const PubSubMock = sinon.stub().returns(pubsubMock)

  return {
    program: proxyquire('./', {
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

test('on minute-tick event logs event data', t => {
  const json = JSON.stringify({ data: MESSAGE })
  const event = {
    data: Buffer.from(json).toString('base64'),
  }

  const sample = getSample()
  sample.program.subscribe(event)

  t.is(console.log.callCount, 1)
  t.deepEqual(console.log.firstCall.args, [json])
})
