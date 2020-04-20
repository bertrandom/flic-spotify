const spotify = require('./lib/spotify');

var devices = {};
var i = 1;

spotify.listDevices().then((data) => {
    let deviceId = null;
    data.forEach(function(device) {
        devices[i] = device.name;
        i++;
    });
    console.log(JSON.stringify(devices));
});