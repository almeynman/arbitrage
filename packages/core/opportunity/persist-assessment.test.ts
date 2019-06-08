import sinon from 'sinon'
import persistAssessment from './persist-assessment'
import Assessment from '../assessment';

test('persists opportunity', () => {
  const persist = sinon.stub()

  const assessment = new Assessment({
    symbol: 'EUR/BTC',
    coefficient: 1.006,
    buy: {
      exchange: 'kraken',
      price: 5682.2,
      expectedFee: 0.01,
    },
    sell: {
      exchange: 'kucoin',
      price: 5592.2,
      expectedFee: 0.005,
    }
  })

  persistAssessment(assessment, persist);

  sinon.assert.callCount(persist, 1);
  sinon.assert.calledWith(persist, assessment);
})

