const { deserialize } = require('arbitrage-lib')

exports.exchangeSymbolTickProcessor = async event => {
  const { exchange, symbol } = deserialize(event.data)
  console.log(exchange)
  console.log(symbol)
}
