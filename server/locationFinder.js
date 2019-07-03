const fetch = require('node-fetch')

function findLocation(lat, long){
    // let options = {
    //     url: "https://nominatim.openstreetmap.org/reverse.php?lat="+lat+"&lon="+long+"&format=json"
    // }

    
    return fetch("https://nominatim.openstreetmap.org/reverse.php?lat="+lat+"&lon="+long+"&format=json");
}

module.exports = findLocation