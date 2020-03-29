const spotify = require('./lib/spotify');

spotify.listDevices().then((data) => {
    let deviceId = null;
    data.forEach(function(device) {
        if (device.name === "Aurora's Room Echo") {
            deviceId = device.id;
        }
    });
    console.log(deviceId);
});