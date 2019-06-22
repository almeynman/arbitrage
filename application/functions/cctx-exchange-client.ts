import ExchangeClient from "implementation/exchange-client"
import ccxt from 'ccxt'
import { resolve } from "path";
import OrderBook from "../../packages/core/order-book";

export class CcxtExchangeClient implements ExchangeClient {
    constructor(private cctx: any) {}
    fetchOrderBook(exchange: string, symbol: string): Promise<OrderBook> {
        return new Promise<OrderBook>((resolve, reject) => {

        })
    }
}