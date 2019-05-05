const sinon = require('sinon')

exports.mockPubSub = () => {
  const topicMock = {
    publish: sinon.stub().returns(Promise.resolve()),
  }
  const pubsubMock = {
    topic: sinon.stub().returns(topicMock),
  }
  const PubSubMock = sinon.stub().returns(pubsubMock)

  return {PubSubMock, pubsubMock, topicMock}
}
