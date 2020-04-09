var config = require('config');
var SpotifyWebApi = require('spotify-web-api-node');
const logger = require('./logger');

var credentials = {
    clientId: config.spotify.client_id,
    clientSecret: config.spotify.client_secret,
    redirectUri: 'https://example.com/callback'
};

var spotifyApi = new SpotifyWebApi(credentials);

// spotifyApi.setAccessToken(config.spotify.access_token);
spotifyApi.setRefreshToken(config.spotify.refresh_token);

const listDevices = () => {

    return spotifyApi.refreshAccessToken().then((data) => {
        spotifyApi.setAccessToken(data.body['access_token']);
        return spotifyApi.getMyDevices().then(function (data) {
            return data.body.devices;
        });
    });

};

const play = () => {

    spotifyApi.refreshAccessToken().then(
        function (data) {
            logger.info('The access token has been refreshed!');

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            return listDevices().then((data) => {
                let deviceId = null;
                data.forEach(function (device) {
                    if (device.name === "Aurora's Room Echo") {
                        deviceId = device.id;
                    }
                });

                return spotifyApi.play({
                    device_id: deviceId,
                    uris: ["spotify:track:4jaXxB0DJ6X4PdjMK8XVfu"],
                    // context_uri: "spotify:album:5x1G4XCXE1i9021srH6cQg",
                    // offset: { "position": 0 },
                    position_ms: 0
                }).then(function (data) {
                    logger.info('playing 1 second of silence');

                    return spotifyApi.play({
                        device_id: deviceId,
                        context_uri: "spotify:playlist:1DgbBmG8i32lPP4nq2SNEK",
                        offset: { "position": 0 },
                        position_ms: 0
                    }).then(function (data) {
                        logger.info('playing playlist');

                        setTimeout(() => {

                            return spotifyApi.setRepeat({
                                device_id: deviceId,
                                state: "context"
                            }).then(function (data) {
                                logger.info('setting repeat state');
                            });


                        }, 2500);

                    });    

                });

            }).catch(function (e) {
                logger.error(e);
            });    

        },
        function (err) {
            logger.error('Could not refresh access token', err);
        }
    );

};

exports.play = play;
exports.listDevices = listDevices;