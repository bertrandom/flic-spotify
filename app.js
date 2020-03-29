const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const spotify = require('./lib/spotify');

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  if (req.body.secret === config.secret) {
    console.log('triggered play');
    spotify.play();
    return res.send('OK');
  }
  res.sendStatus(401);
});

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));