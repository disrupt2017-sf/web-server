var request = require('request');

function getGeoCoordinates(location, callback) {
  var locationUri = `https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_KEY}&location=${location}`;
  request.post({
    uri: locationUri,
  }, function(err, res){
    if(err) {
      console.log(err);
      return callback(err);
    }
    var resJson = JSON.parse(res.body);
    return callback(null, resJson.results[0].locations[0].latLng);
  })
}

module.exports = getGeoCoordinates;