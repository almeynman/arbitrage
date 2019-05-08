const Firestore = require('@google-cloud/firestore')
const { projectId } = require('arbitrage-lib')

const firestore = new Firestore({ projectId })

;(async function() {
  for (let i = 0; i < 100; i++) {
    await firestore
      .collection('symbol-tick')
      .orderBy('timestamp', 'asc')
      .limit(100)
      .get()
      .then(snapshot => {
        var batch = firestore.batch()
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          console.log(data)
          if (data.kraken == null) {
            console.log('delete data')
            batch.delete(doc.ref)
          }
        })
        return batch.commit().then(() => {
          return snapshot.size
        })
      })
  }
})()
