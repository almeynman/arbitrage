import { verify, when, anything, instance, capture, mock } from 'ts-mockito'
import { mockFn } from 'ts-lib-common'
import { right } from 'fp-ts/lib/TaskEither'

import { arbitrate, ExchangeArgs } from './arbitrate'
import { FetchOrderBook } from './fetch-order-book'
import { SaveAssessment } from './save-assessment'
import { Assess, AssessmentPair } from './assess'
import { createOrderBook } from './order-book'
import { pipe } from 'fp-ts/lib/pipeable'
import { Assessment } from './assessment'
import { fold } from 'fp-ts/lib/Either'
import { OrderBook } from '.'

let mockedFetchOrderBook: FetchOrderBook
let fetchOrderBook: FetchOrderBook
let mockedSaveAssessment: SaveAssessment
let saveAssessment: SaveAssessment
let exchanges: [ExchangeArgs, ExchangeArgs]
const symbol = 'FOO/BAR'
let mockedAssess: Assess
let assess: Assess

beforeEach(() => {
  mockedFetchOrderBook = mockFn<FetchOrderBook>()
  fetchOrderBook = instance(mockedFetchOrderBook)
  when(mockedFetchOrderBook(anything())).thenReturn((_: string) =>
    right(createOrderBook({
      buyWall: [{ price: 1.9, volume: 0 }],
      sellWall: [{ price: 1.90001, volume: 0 }],
    }))
  )

  mockedSaveAssessment = mockFn<SaveAssessment>()
  when(mockedSaveAssessment(anything())).thenReturn(right(mock<Assessment>()))
  saveAssessment = instance(mockedSaveAssessment)

  const exchange1 = {
    fees: {
      taker: 1,
    },
    name: 'exchange1',
  }

  const exchange2 = {
    fees: {
      taker: 1,
    },
    name: 'exchange2',
  }

  exchanges = [exchange1, exchange2]
  mockedAssess = mockFn<Assess>()
  when(mockedAssess(anything())).thenReturn(mock<AssessmentPair>())
  assess = instance(mockedAssess)
})

test('should fetch order book for two exchanges', async () => {
  await arbitrate({
    fetchOrderBook,
    saveAssessment,
    exchanges,
    symbol,
    assess,
  })()

  verify(mockedFetchOrderBook(anything())).twice()
  const [firstArg] = capture(mockedFetchOrderBook).first()
  expect(firstArg).toEqual(symbol)
  const [lastArg] = capture(mockedFetchOrderBook).last()
  expect(lastArg).toEqual({ exchange: exchanges[1].name, symbol })
})

test('should assess for opportunity for any two exchanges', async () => {
  const either = await arbitrate({
    fetchOrderBook,
    saveAssessment,
    exchanges,
    symbol,
    assess,
  })()

  pipe(
    either,
    fold(
      () => { expect(true).toBe(false) },
      (assessments: Assessment[]) => {
        console.log(assessments)
      }
    )
  )


  //   verify((mockedAssess(anything()))).once()
})

// test('should persist assessments', async () => {
//   await arbitrate({
//     fetchOrderBook,
//     saveAssessment,
//     exchanges,
//     symbol,
//     assess,
//   })

//   verify(mockedSaveAssessment(anything())).twice()
// })

// test('should not find opportunity if illiquid markets', async () => {
//   when(mockedFetchOrderBook(anything())).thenReturn(Promise.resolve(
//     createOrderBook({
//       buyWall: [{ price: 1.9, volume: 0 }],
//       sellWall: [{ price: 2.8, volume: 0 }],
//     }),
//   ))

//   let catched = 0
//   try {
//     await arbitrate({
//       fetchOrderBook,
//       saveAssessment,
//       exchanges,
//       symbol,
//       assess,
//     })
//   } catch (e) {
//     expect(e.message.startsWith('One of the markets is illiquid')).toBe(true)
//     catched += 1
//   }
//   expect(catched).toBe(1)
// })
