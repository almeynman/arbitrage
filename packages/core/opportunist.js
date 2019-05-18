exports.opportunist = function opportunist(orderBook1, orderBook2) {
  if (isPriceOpportunity(orderBook1.buy[0], orderBook2.sell[0])) {
    return {}
  }
  return null
}

function isPriceOpportunity(buyOrder, sellOrder) {
  return buyOrder.price < sellOrder.price
}
