const Firestore = require('@google-cloud/firestore')
const { projectId } = require('arbitrage-lib')

const firestore = new Firestore({ projectId })

;(async function() {
  await firestore
    .collection('symbol-tick')
    .orderBy('__name__')
    .limit(100)
    .get()
    .then(snapshot => {
      var batch = firestore.batch()
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.timestamp == null) {
          batch.delete(doc.ref)
        }
      })
      return batch.commit().then(() => {
        return snapshot.size
      })
    })
})()
