const Firestore = require('@google-cloud/firestore')
const { projectId } = require('arbitrage-lib')

const firestore = new Firestore({ projectId })

;(async function() {
    await firestore
      .collection('symbol-ticks')
      .orderBy('timestamp', 'asc')
      .limit(1000)
      .get()
      .then(snapshot => {
        console.log('Data received...')
        snapshot.docs.forEach(doc => {
          const symbolTick = doc.data()
          const exchangesData = symbolTick.data.map(exchange => ({
            exchangeId: exchange.id,
            buyPrice: exchange.ticker.ask,
            sellPrice:  exchange.ticker.bid
          }))

          const coeficient = checkOpportunity(exchangesData[0].buyPrice, exchangesData[1].sellPrice)
          const coeficient2 = checkOpportunity(exchangesData[1].buyPrice, exchangesData[0].sellPrice)

          if (coeficient > 1) {
            console.log(`Oppotunity to buy from ${exchangesData[0].exchangeId} at ${exchangesData[0].buyPrice} and sell to ${exchangesData[1].exchangeId} at ${exchangesData[1].sellPrice}`)
          }

          if (coeficient2 > 1) {
            console.log(`Oppotunity to buy from ${exchangesData[1].exchangeId} at ${exchangesData[1].buyPrice} and sell to ${exchangesData[0].exchangeId} at ${exchangesData[0].sellPrice}`)
          }
        })
      })
})()


function checkOpportunity(aExchangeBuyPrice, bExchangeSellPrice) {
  return bExchangeSellPrice/aExchangeBuyPrice
}
