import ExchangeFees from 'core/exchange-fees'

import * as exchangeFees from './exchanges-config.json'

test('should deserialize from json', () => {
    const fee = ExchangeFees.fromJson(exchangeFees, 'kucoin')
    expect(fee.taker).toBe(0.1)
})