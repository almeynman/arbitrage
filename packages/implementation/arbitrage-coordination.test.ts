import sinon from 'sinon'

import Market from 'core/market'
import OrderBook from 'core/order-book'
import Order from 'core/order'
import Exchange from 'core/exchange'
import Opportunist from 'core/opportunist'

import ArbitrageCoordination, { ExchangeArgs } from './arbitrage-coordination'

let exchangeClient: any
let opportunist: any
let opportunityRepository: any
let arbitrageCoordination: ArbitrageCoordination

let exchange1: ExchangeArgs
let exchange2: ExchangeArgs

let symbol = 'FOO/BAR'

beforeEach(() => {
    exchangeClient = {
        fetchOrderBook: sinon.stub().returns(Promise.resolve(new OrderBook({buyWall: [new Order(0)], sellWall: [new Order(0)]})))
    }

    opportunist = {
        findOpportunity: sinon.spy()
    }

    opportunityRepository = {
        save: sinon.spy()
    }

    exchange1 = {
        name: 'exchange1',
        fees: {
            buy: 1,
            sell: 1
        }
    }

    exchange2 = {
        name: 'exchange2',
        fees: {
            buy: 1,
            sell: 1
        }
    }

    arbitrageCoordination = new ArbitrageCoordination(exchangeClient, opportunist, opportunityRepository, [exchange1, exchange2], symbol)
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

test('should persist opportunity', async () => {
    await arbitrageCoordination.arbitrate()
    expect(opportunityRepository.save.calledOnce).toBeTruthy()
})
