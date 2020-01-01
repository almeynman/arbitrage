import { TaskEither } from 'fp-ts/lib/TaskEither'
import { OrderBook } from "./order-book"

export type FetchOrderBook = (symbol: string) => (exchange: string) => TaskEither<Error, OrderBook>
