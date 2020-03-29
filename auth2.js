var config = require('config');

var SpotifyWebApi = require('spotify-web-api-node');


var credentials = {
  clientId: config.spotify.client_id,
  clientSecret: config.spotify.client_secret,
  redirectUri : 'https://example.com/callback'
};

var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI
var code = '';

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(code)
  .then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    console.log(data.body);

  }, function(err) {
    console.log('Something went wrong!', err);
  });