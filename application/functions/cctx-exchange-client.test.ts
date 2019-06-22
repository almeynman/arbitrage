import { CcxtExchangeClient } from "./cctx-exchange-client";

test('calls the cctx client to get orders book for symbol', () => {
    const ccxtExchangeClient = new CcxtExchangeClient();
    ccxtExchangeClient.fetchOrderBook('kraken', 'BTC/USD')
})