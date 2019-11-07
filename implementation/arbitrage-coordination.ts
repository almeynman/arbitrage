import ExchangeClient from './exchange-client'
import {
    Opportunist,
    Exchange,
    createMarket,
    ExchangeFees,
    OrderBook,
    createOrderBook,
} from 'core'
import R from 'ramda';
import AssessmentRepository from './assessment-repository';

export interface ExchangeArgs {
    name: string
    fees: {
        taker: number
    }
}

export default class ArbitrageCoordination {
    constructor(
        private exchangeClient: ExchangeClient,
        private opportunist: Opportunist,
        private assessmentRepository: AssessmentRepository,
        private exchanges: ExchangeArgs[],
        private symbol: string
    ) { }

    public async arbitrate() {
        const orderBooks = await this.fetchOrderBooks()
        const [exchange1, exchange2] = this.instantiateExchanges(orderBooks)

        const market1 = exchange1.markets[this.symbol]
        const market2 = exchange2.markets[this.symbol]

        if (!market1.isLiquid) {
            throw new Error(`One of the markets is illiquid ${JSON.stringify(market1, null, 4)}`)
        }

        if (!market2.isLiquid) {
            throw new Error(`One of the markets is illiquid ${JSON.stringify(market2, null, 4)}`)
        }

        const { assessment1, assessment2 } = this.opportunist.findOpportunity({ symbol: this.symbol, exchange1, exchange2 })
        await Promise.all([this.assessmentRepository.save(assessment1), this.assessmentRepository.save(assessment2)])
    }

    private instantiateExchanges(orderBooks: OrderBook[]): [Exchange, Exchange] {
        const [exchange1, exchange2] = R.zip(this.exchanges, orderBooks).map(([exchange, orderBook]) => {
            return new Exchange(
                exchange.name,
                { [this.symbol]: createMarket({ symbol: this.symbol, orderBook }) },
                new ExchangeFees(exchange.fees.taker)
            )
        })

        return [exchange1, exchange2]
    }

    private fetchOrderBooks(): Promise<OrderBook[]> {
        return Promise.all(this.exchanges.map((exchange) => this.exchangeClient.fetchOrderBook(exchange.name, this.symbol)))
    }
}

