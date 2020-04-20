var config = require('config');
var SpotifyWebApi = require('spotify-web-api-node');
const logger = require('./logger');

var credentials = {
    clientId: config.spotify.client_id,
    clientSecret: config.spotify.client_secret,
    redirectUri: 'https://example.com/callback'
};

var dateExpired = null;

var spotifyApi = new SpotifyWebApi(credentials);

// spotifyApi.setAccessToken(config.spotify.access_token);
spotifyApi.setRefreshToken(config.spotify.refresh_token);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const refreshAccessToken = () => {

    logger.info('refreshing access token');

    return spotifyApi.refreshAccessToken().then((data) => {
        spotifyApi.setAccessToken(data.body['access_token']);

        logger.info('access token refreshed');

        // Save the amount of seconds until the access token expired
        var tokenExpirationEpoch = Math.floor(new Date().getTime() / 1000) + data.body['expires_in'];
        dateExpired = tokenExpirationEpoch;

        return true;

    });

};

const refreshIfNeeded = () => {

    if (dateExpired === null || dateExpired <= Math.floor(new Date().getTime() / 1000)) {
        return refreshAccessToken();
    }

    return Promise.resolve(true);

}

const listDevices = () => {

    return refreshIfNeeded().then((refreshed) => {
        return spotifyApi.getMyDevices().then(function (data) {
            return data.body.devices;
        });
    });

};

const getDevice = (deviceIndex) => {

    return listDevices().then((data) => {
        let deviceId = null;
        data.forEach(function (device) {
            if (device.name === config.devices[deviceIndex]) {
                deviceId = device.id;
            }
        });
        return deviceId;
    });

};

const playSilentTrack = (deviceId) => {

    return spotifyApi.play({
        device_id: deviceId,
        uris: ["spotify:track:4jaXxB0DJ6X4PdjMK8XVfu"],
        position_ms: 0
    }).then(function (data) {
        logger.info('playing 1 second of silence');
    });

};

const playPlaylist = (deviceIndex, uri) => {

    return getDevice(deviceIndex).then((deviceId) => {
        return playSilentTrack(deviceId).then(() => {
            return spotifyApi.play({
                device_id: deviceId,
                context_uri: uri,
                offset: { "position": 0 },
                position_ms: 0
            }).then(function (data) {
                logger.info('playing playlist');
                return delay(1000).then(() => {
                    return spotifyApi.setRepeat({
                        device_id: deviceId,
                        state: "context"
                    }).then(function (data) {
                        logger.info('setting repeat state');
                    });
                });
            });            
        });
    });

};

const playTrack = (deviceIndex, uri) => {

    return getDevice(deviceIndex).then((deviceId) => {
        return playSilentTrack(deviceId).then(() => {
            return spotifyApi.play({
                device_id: deviceId,
                uris: [uri],
                position_ms: 0
            }).then(function (data) {
                logger.info('playing track ' + uri);
                return spotifyApi.setRepeat({
                    device_id: deviceId,
                    state: "off"
                }).then(function (data) {
                    logger.info('setting repeat state to off');
                });
            });
        });
    });

};

exports.playPlaylist = playPlaylist;
exports.playTrack = playTrack;
exports.listDevices = listDevices;
