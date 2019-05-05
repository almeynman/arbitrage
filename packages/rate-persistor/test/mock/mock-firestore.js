const sinon = require('sinon')

exports.mockFirestore = () => {
  const collectionMock = {
    add: sinon.stub().returns(Promise.resolve()),
  }
  const firestoreMock = {
    collection: sinon.stub().returns(collectionMock),
  }
  const FirestoreMock = sinon.stub().returns(firestoreMock)

  return {FirestoreMock, firestoreMock, collectionMock}
}
