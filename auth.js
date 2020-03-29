var config = require('config');

var SpotifyWebApi = require('spotify-web-api-node');

var scopes = ['user-modify-playback-state', 'user-read-playback-state','streaming'],
    redirectUri = 'https://example.com/callback',
    clientId = config.spotify.client_id,
    state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri : redirectUri,
  clientId : clientId
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

console.log(authorizeURL);