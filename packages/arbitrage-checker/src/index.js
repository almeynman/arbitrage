const Firestore = require('@google-cloud/firestore')
const { projectId } = require('arbitrage-lib')
const { Observable, combineLatest } = require('rxjs')
const { map } = require('rxjs/operators')

const firestore = new Firestore({ projectId })

;(async function() {
  const symbol = 'ETH/BTC'
  let krakenData$ = toDataObservable(getQuery('kraken', symbol))
  let kucoinData$ = toDataObservable(getQuery('kucoin', symbol))
  combineLatest(krakenData$, kucoinData$).subscribe(console.log)
})()

function toDataObservable(query) {
  return Observable
    .create(observer => query.onSnapshot(s => observer.next(s), e => observer.error(e)))
    .pipe(map(snapshot => snapshot.docs[0].data()))
}

function getQuery(exchangeId, symbol) {
  return firestore
    .collection('symbol-tick')
    .where('exchangeId', '==', exchangeId)
    .where('symbol', '==', symbol)
    .orderBy('timestamp', 'desc')
}
