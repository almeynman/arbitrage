import CCXTExchangeClient from './ccxt-exchange-client'

class AnyExchange {
    public async fetchOrderBook(symbol: string): Promise<any> {
        return {
            bids: [
                {
                    price: 0.9,
                    amount: 1
                },
                {
                    price: 0.8,
                    amount: 2
                }
            ],
            asks: [
                {
                    price: 1,
                    amount: 1
                },
                {
                    price: 2,
                    amount: 2
                }
            ]
        }
    }
}

test('should obtain an order book', async () => {
    const anyExchange = 'any'
    const anySymbol = 'foobar'

    const ccxt = {
       'any': AnyExchange 
    }

    const ccxtExchangeClient = new CCXTExchangeClient(ccxt)

    const orderBook = await ccxtExchangeClient.fetchOrderBook(anyExchange, anySymbol)

    expect(orderBook).not.toBeNull()
    expect(orderBook.getBestBuyPrice()).toBe(0.9)
    expect(orderBook.getBestSellPrice()).toBe(1)
})