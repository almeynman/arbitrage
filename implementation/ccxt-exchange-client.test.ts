import getCcxtExchangeClient from './ccxt-exchange-client'

class AnyExchange {
    public async loadMarkets() {}
    public async fetchOrderBook(symbol: string): Promise<any> {
        return {
            bids: [
                [
                    0.9,
                    1
                ],
                [
                    0.8,
                    2
                ]
            ],
            asks: [
                [
                    1,
                    1
                ],
                [
                    2,
                    2
                ]
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

    const ccxtExchangeClient = getCcxtExchangeClient(ccxt)

    const orderBook = await ccxtExchangeClient.fetchOrderBook(anyExchange, anySymbol)

    expect(orderBook).not.toBeNull()
    expect(orderBook.bestBuyPrice).toBe(0.9)
    expect(orderBook.bestSellPrice).toBe(1)
})
