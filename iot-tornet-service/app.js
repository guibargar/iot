'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const app = express()

var latestReading = ""

app.get('/readings', (req, res) => {
  res.json(latestReading);
});

app.post('/readings', jsonParser, (req, res) => {
  latestReading = req.body
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
