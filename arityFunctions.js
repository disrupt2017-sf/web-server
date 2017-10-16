var request = require('request');

function createPolygon(lat, lng) {
  return `POLYGON(${lat-0.000000005} ${lng-0.000000005} ${lat-0.000000005} ${lng + 0.000000005} ${lat + 0.000000005} ${lng - 0.000000005} ${lat + 0.0000005} ${lng + 0.0000005})`;
}

function getSafeAlertsByLocation(lat, lng, radius, callback){
  console.log('request');
  geography = createPolygon(lat, lng);
  request.get(`https://api-beta.arity.com/riskIndex/v1/riskInfo?geometry=${geography}&radius=${radius}`,
  {
    strictSSL: false,
  },
  function(err, res){
    if(err){
      console.log('some err');
      console.log(err);
      return callback(err);
    }
    var message = JSON.parse(res.body)
    console.log(message);
    return callback(null, message);
  });
}

module.exports = getSafeAlertsByLocation;