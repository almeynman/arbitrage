const Firestore = require('@google-cloud/firestore')
const { projectId, collections } = require('arbitrage-lib')

const firestore = new Firestore({ projectId })

;(async function() {
    await firestore
      .collection('symbol-ticks')
      .orderBy('timestamp', 'asc')
      .limit(1000)
      .get()
      .then(snapshot => {
        
        })
      })
})()
