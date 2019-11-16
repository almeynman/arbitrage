import { OrderBook } from './order-book'

export interface Market {
  symbol: string;
  orderBook: OrderBook;
  bestBuyPrice: number;
  bestSellPrice: number;
  isLiquid: boolean;
}

interface CreateMarketArgs {
  symbol: string;
  orderBook: OrderBook;
  liquidityThreshold?: number;
}

export const createMarket = ({ symbol, orderBook, liquidityThreshold = 0.001 }: CreateMarketArgs): Market => {
  const bestBuyPrice = orderBook.bestBuyPrice
  const bestSellPrice = orderBook.bestSellPrice
  const isLiquid = (bestSellPrice - bestBuyPrice) / bestSellPrice < liquidityThreshold
  return {
    symbol,
    orderBook,
    bestBuyPrice,
    bestSellPrice,
    isLiquid,
  }
}
