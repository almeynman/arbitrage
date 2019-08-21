import * as sinon from 'sinon'
import Assessment from 'core/assessment'
import FirestoreOpportunityRepository from './firestore-opportunity-repository'
import { CollectionReference } from '@google-cloud/firestore';
import * as chai from 'chai'
import sinonChai from 'sinon-chai'

const expect = chai.expect;
chai.use(sinonChai)

test('saves an opportunity to a collection', async () => {
  const collection = sinon.createStubInstance(CollectionReference)
  const opportunityRepository = new FirestoreOpportunityRepository(collection as any)
  const opportunity = new Assessment({
    symbol: 'EUR/BTC',
    coefficient: 1.1,
    buy: {
      exchange: 'exchange1',
      price: 8000,
      expectedFee: 0.01
    },
    sell: {
      exchange: 'exchange2',
      price: 8100,
      expectedFee: 0.02
    },
  })
  opportunityRepository.save(opportunity)
  expect(collection.add).to.have.been.called
});
