'use strict';

const Firestore = require('@google-cloud/firestore');
const db = new Firestore();
const readingsCollection = 'readings';

function readingFilterByDate(date1, date2) {
  const response = []
  console.log(`Reading filter by date: ${date1} , ${date2}`)
  return db.collection(readingsCollection)
  .where('timestamp', '>=', date1.toISOString().slice(0,10))
  .where('timestamp', '<=', date2.toISOString().slice(0,10)).get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      response.push(doc.data());
    });
    console.log(`Query result: ${response}`)
    return response
  })
  .catch((err) => {
    console.log('Error getting documents', err);
    return response
  });
}

function readingsToday() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return readingFilterByDate(today, tomorrow)
}

function addReading(reading) {
  let timestamp = (typeof reading.timestamp != "undefined") ? reading.timestamp : new Date().toISOString()
  let readingsRef = db.collection(readingsCollection).doc(timestamp);
  readingsRef.set(reading);
}

module.exports = {readingFilterByDate,readingsToday,addReading}