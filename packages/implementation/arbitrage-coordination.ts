import ExchangeClient from './exchange-client'

export interface ExchangeArgs {
    name: string
    fees: {
        buy: number
        sell: number
    }
}

export default class ArbitrageCoordination {
    constructor(private exchangeClient: ExchangeClient, private exchanges: ExchangeArgs[], private symbol: string) { }

    public arbitrate() {
        this.exchanges.forEach((exchange) => {
            this.exchangeClient.fetchOrderBook(exchange.name, this.symbol)
        })
    }
}
