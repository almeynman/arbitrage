import Exchange from './exchange'
import Opportunity from './opportunity';

export default function opportunist(exchange1: Exchange, exchange2: Exchange) {
  if (isOpportunity(exchange1, exchange2)) {
    return {}
  }

  if (isOpportunity(exchange2, exchange1)) {
    return {}
  }

  return null
}

function isOpportunity(exchange1: Exchange, exchange2: Exchange): boolean {
  return exchange1.getBuyCost() < exchange2.getSellCost()
}
