import sinon from 'sinon'

import { createOrderBook } from '.'
import { arbitrate, ExchangeArgs } from './arbitrate'

let exchangeClient: any
let assessmentRepository: any
let exchanges: [ExchangeArgs, ExchangeArgs]
const symbol = 'FOO/BAR'
let assess: any

beforeEach(() => {
  exchangeClient = {
    fetchOrderBook: sinon.stub().returns(
      Promise.resolve(
        createOrderBook({
          buyWall: [{ price: 1.9, volume: 0 }],
          sellWall: [{ price: 1.8, volume: 0 }],
        }),
      ),
    ),
  }

  assessmentRepository = {
    save: sinon.spy(),
  }

  const exchange1 = {
    fees: {
      taker: 1,
    },
    name: 'exchange1',
  }

  const exchange2 = {
    fees: {
      taker: 1,
    },
    name: 'exchange2',
  }

  exchanges = [exchange1, exchange2]
  assess = sinon.stub().returns({})
})

test('should fetch order book for two exchanges', async () => {
  await arbitrate({
    exchangeClient,
    assessmentRepository,
    exchanges,
    symbol,
    assess,
  })

  expect(exchangeClient.fetchOrderBook.calledTwice).toBeTruthy()
})

test('should fetch order books for any two exchanges', async () => {
  await arbitrate({
    exchangeClient,
    assessmentRepository,
    exchanges,
    symbol,
    assess,
  })

  expect(exchangeClient.fetchOrderBook.withArgs('exchange1', symbol).calledOnce).toBeTruthy()
  expect(exchangeClient.fetchOrderBook.withArgs('exchange2', symbol).calledOnce).toBeTruthy()
})

test('should find opportunity for any two exchanges', async () => {
  await arbitrate({
    exchangeClient,
    assessmentRepository,
    exchanges,
    symbol,
    assess,
  })

  expect(assess.calledOnce).toBeTruthy()
})

test('should persist assessments', async () => {
  await arbitrate({
    exchangeClient,
    assessmentRepository,
    exchanges,
    symbol,
    assess,
  })

  expect(assessmentRepository.save.calledTwice).toBeTruthy()
})

test('should not find opportunity if illiquid markets', async () => {
  exchangeClient = {
    fetchOrderBook: sinon.stub().returns(
      Promise.resolve(
        createOrderBook({
          buyWall: [{ price: 1.9, volume: 0 }],
          sellWall: [{ price: 2.8, volume: 0 }],
        }),
      ),
    ),
  }

  let catched = 0
  try {
    await arbitrate({
      exchangeClient,
      assessmentRepository,
      exchanges,
      symbol,
      assess,
    })
  } catch (e) {
    expect(e.message.startsWith('One of the markets is illiquid')).toBe(true)
    catched += 1
  }
  expect(catched).toBe(1)
})
