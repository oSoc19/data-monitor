const fetch = require('node-fetch');

async function findLocation(lat, long) {
    return await fetch('https://nominatim.openstreetmap.org/reverse.php?lat=' + lat + '&lon=' + long + '&format=json');
}

module.exports = findLocation;