import sinon from 'sinon'

import {
    Opportunist,
    Exchange,
    Market,
    createOrderBook
} from 'core'

import ArbitrageCoordination, { ExchangeArgs } from './arbitrage-coordination'

let exchangeClient: any
let opportunist: any
let assessmentRepository: any
let arbitrageCoordination: ArbitrageCoordination

let exchange1: ExchangeArgs
let exchange2: ExchangeArgs

let symbol = 'FOO/BAR'

beforeEach(() => {
    exchangeClient = {
        fetchOrderBook: sinon.stub().returns(Promise.resolve(createOrderBook({ buyWall: [{ price: 1.9, volume: 0 }], sellWall: [{ price: 1.8, volume: 0 }] })))
    }

    opportunist = {
        findOpportunity: sinon.stub().returns({})
    }

   assessmentRepository = {
        save: sinon.spy()
    }

    exchange1 = {
        name: 'exchange1',
        fees: {
            taker: 1,
        }
    }

    exchange2 = {
        name: 'exchange2',
        fees: {
            taker: 1,
        }
    }

    arbitrageCoordination = new ArbitrageCoordination(exchangeClient, opportunist, assessmentRepository, [exchange1, exchange2], symbol)
})

test('should fetch order book for two exchanges', async () => {
    await arbitrageCoordination.arbitrate()

    expect(exchangeClient.fetchOrderBook.calledTwice).toBeTruthy()
})

test('should fetch order books for any two exchanges', async () => {
    await arbitrageCoordination.arbitrate()

    expect(exchangeClient.fetchOrderBook.withArgs('exchange1', symbol).calledOnce).toBeTruthy()
    expect(exchangeClient.fetchOrderBook.withArgs('exchange2', symbol).calledOnce).toBeTruthy()
})

test('should find opportunity for any two exchanges', async () => {
    await arbitrageCoordination.arbitrate()

    expect(opportunist.findOpportunity.calledOnce).toBeTruthy()
})

test('should persist assessments', async () => {
    await arbitrageCoordination.arbitrate()
    expect(assessmentRepository.save.calledTwice).toBeTruthy()
})

test('should not find opportunity if illiquid markets', async () => {
    exchangeClient = {
        fetchOrderBook: sinon.stub().returns(Promise.resolve(createOrderBook({ buyWall: [{ price: 1.9, volume: 0 }], sellWall: [{ price: 2.8, volume: 0 }] })))
    }
    arbitrageCoordination = new ArbitrageCoordination(exchangeClient, opportunist, assessmentRepository, [exchange1, exchange2], symbol)

    let catched = 0
    try {
        await arbitrageCoordination.arbitrate()
    } catch (e) {
        expect(e.message.startsWith('One of the markets is illiquid')).toBe(true)
        catched++
    }
    expect(catched).toBe(1)
})
