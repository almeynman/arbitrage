import ExchangeClient from './exchange-client'
import Opportunist from 'core/opportunist'
import Exchange from 'core/exchange'
import Market from 'core/market'
import ExchangeFees from 'core/exchange-fees'
import OrderBook from 'core/order-book'

import R from 'ramda';
import OpportunityRepository from './opportunity-repository';

export interface ExchangeArgs {
    name: string
    fees: {
        buy: number
        sell: number
    }
}

export default class ArbitrageCoordination {
    constructor(
        private exchangeClient: ExchangeClient,
        private opportunist: Opportunist,
        private opportunityRepository: OpportunityRepository,
        private exchanges: ExchangeArgs[],
        private symbol: string
    ) { }

    public async arbitrate() {
        const orderBooks = await this.fetchOrderBooks()

        const [exchange1, exchange2] = this.instantiateExchanges(orderBooks)

        const opportunity = this.opportunist.findOpportunity({symbol: this.symbol, exchange1, exchange2})
        this.opportunityRepository.save(opportunity)
    }

    private instantiateExchanges(orderBooks: OrderBook[]): [Exchange, Exchange] {
        const [exchange1, exchange2] = R.zip(this.exchanges, orderBooks).map(([exchange, orderBook]) => {
            return new Exchange(
                exchange.name,
                { [this.symbol] : new Market(this.symbol, orderBook) },
                new ExchangeFees(exchange.fees.buy, exchange.fees.sell)
            )
        })

        return [exchange1, exchange2]
    }

    private fetchOrderBooks(): Promise<OrderBook[]> {
        return Promise.all(this.exchanges.map((exchange) => this.exchangeClient.fetchOrderBook(exchange.name, this.symbol)))
    }
}
