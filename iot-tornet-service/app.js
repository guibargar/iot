'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const app = express()

const db = require('./db')
const error = '{ "error" : "500", "message": "Something went wrong" }'
var latestReading = ""


app.get('/readings', (req, res) => {
  res.json(latestReading);
});

app.get('/readings/today', (req, res) => {
  db.readingsToday()
  .then( (todaysReadings) => {
    console.log(`Today's readings: ${todaysReadings}`)
    res.json(todaysReadings)
  })  
});

app.post('/readings', jsonParser, (req, res) => {
  db.addReading(req.body)
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