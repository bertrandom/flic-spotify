const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const spotify = require('./lib/spotify');
const logger = require('./lib/logger');

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  if (req.body.secret === config.secret) {
    logger.info('triggered play');
    spotify.play();
    return res.send('OK');
  }
  logger.error('invalid secret');
  res.sendStatus(401);
});

app.listen(config.port, () => logger.info(`Server running on port ${config.port}`));