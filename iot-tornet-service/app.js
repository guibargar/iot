'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const app = express()

const Firestore = require('@google-cloud/firestore');
const db = new Firestore();
const error = '{ "error" : "500", "message": "Something went wrong" }'
var latestReading = ""


app.get('/readings', (req, res) => {
  res.json(latestReading);
});

app.get('/test', (req, res) => {
  let response = []
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  db.collection('readings')
  .where('timestamp', '>', today.toISOString().slice(0,10))
  .where('timestamp', '<', tomorrow.toISOString().slice(0,10)).get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      response.push(doc.data());
    });
    res.json(response);
  })
  .catch((err) => {
    console.log('Error getting documents', err);
    res.status(500).json(error)
  });
});

app.post('/readings', jsonParser, (req, res) => {
  latestReading = req.body
  let timestamp = (typeof req.body.timestamp != "undefined") ? req.body.timestamp : new Date().toISOString()
  let todaysReadingsRef = db.collection('readings').doc(timestamp);
  let setTodaysReadings = todaysReadingsRef.set(req.body);

  console.log("Body"+latestReading);
  res.status(200).send()
});

if (module === require.main) {
  app.use(bodyParser.json())
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;