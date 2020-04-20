const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const spotify = require('./lib/spotify');
const logger = require('./lib/logger');

const AURORAS_ROOM = 2;
const BATHROOM = 5;
const BERTS_LAPTOP = 3;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/wash', (req, res) => {
  if (req.body.secret === config.secret) {
    logger.info('triggered wash your hands');
    spotify.playTrack(BATHROOM, 'spotify:track:41uiNzyTgqD83oAKj2WoCJ');
    return res.send('OK');
  }
  logger.error('invalid secret');
  res.sendStatus(401);
});

app.post('/bedtime', (req, res) => {
  if (req.body.secret === config.secret) {
    logger.info('triggered bedtime');
    spotify.playPlaylist(AURORAS_ROOM, 'spotify:playlist:1DgbBmG8i32lPP4nq2SNEK');
    return res.send('OK');
  }
  logger.error('invalid secret');
  res.sendStatus(401);
});

app.post('/test', (req, res) => {
  if (req.body.secret === config.secret) {
    logger.info('triggered wash your hands');
    spotify.playTrack(BERTS_LAPTOP, 'spotify:track:41uiNzyTgqD83oAKj2WoCJ');
    return res.send('OK');
  }
  logger.error('invalid secret');
  res.sendStatus(401);
});


app.listen(config.port, () => logger.info(`Server running on port ${config.port}`));