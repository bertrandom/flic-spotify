var config = require('config');
var SpotifyWebApi = require('spotify-web-api-node');

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
            console.log('The access token has been refreshed!');

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
                    uris: ["spotify:track:4jaXxB0DJ6X4PdjMK8XVfu", "spotify:track:2gw4u7UqW2BHZOGinqU3Ao"],
                    position_ms: 0
                }).then(function (data) {
                    console.log('playing tracks');

                    setTimeout(() => {

                        return spotifyApi.setRepeat({
                            device_id: deviceId,
                            state: "context"
                        }).then(function (data) {
                            console.log('setting repeat state');
                        });


                    }, 2500);

                });    

            });

        },
        function (err) {
            console.log('Could not refresh access token', err);
        }
    );

};

exports.play = play;
exports.listDevices = listDevices;