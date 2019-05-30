import Exchange from './exchange'
import Opportunity from './opportunity';

export default function opportunist(exchange1: Exchange, exchange2: Exchange): Opportunity {
  if (isOpportunity(exchange1, exchange2)) {
    return {
      coeficient
    }
  }
  if (isOpportunity(exchange2, exchange1)) {
    return {}
  }
  return null
}

function isOpportunity(exchange1: Exchange, exchange2: Exchange): number {
  return exchange1.getBuyCost() < exchange2.getSellCost()
}
