const { projectId, collections } = require('arbitrage-lib')

const Firestore = require('@google-cloud/firestore')
const firestore = new Firestore({ projectId })

exports.opportunity = (data) => {
    console.log('received data')
    findOpportunity(data.value)
}

const findOpportunity = symbolTick => {
  console.log('Data received...')
  const exchangesData = symbolTick.data.map(exchange => ({
    exchangeId: exchange.id,
    buyPrice: exchange.ticker.ask,
    sellPrice: exchange.ticker.bid,
  }))

  const coeficient = checkOpportunity(exchangesData[0].buyPrice, exchangesData[1].sellPrice)
  const coeficient2 = checkOpportunity(exchangesData[1].buyPrice, exchangesData[0].sellPrice)

  if (coeficient > 1) {
    console.log(
      `Oppotunity to buy from ${exchangesData[0].exchangeId} at ${exchangesData[0].buyPrice} and sell to ${
        exchangesData[1].exchangeId
      } at ${exchangesData[1].sellPrice}`,
    )
    persistOpportunity(
      coeficient,
      exchangesData[0].exchangeId,
      exchangesData[1].exchangeId,
      exchangesData[0].buyPrice,
      exchangesData[1].sellPrice,
    )
  }

  if (coeficient2 > 1) {
    console.log(
      `Oppotunity to buy from ${exchangesData[1].exchangeId} at ${exchangesData[1].buyPrice} and sell to ${
        exchangesData[0].exchangeId
      } at ${exchangesData[0].sellPrice}`,
    )
    persistOpportunity(
      coeficient2,
      exchangesData[1].exchangeId,
      exchangesData[0].exchangeId,
      exchangesData[1].buyPrice,
      exchangesData[0].sellPrice,
    )
  }
}

function checkOpportunity(aExchangeBuyPrice, bExchangeSellPrice) {
  return bExchangeSellPrice / aExchangeBuyPrice
}

function persistOpportunity(coeficient, buyExchangeId, sellExchangeId, buyPrice, sellPrice) {
  const data = {
    coeficient: coeficient,
    buy: {
      exchange: buyExchangeId,
      price: buyPrice,
    },
    sell: {
      exchange: sellExchangeId,
      price: sellPrice,
    },
    timestamp: Date.now(),
  }

  return firestore.collection(collections.OPPORTUNITY).add(data)
}