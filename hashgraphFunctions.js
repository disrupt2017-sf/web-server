var request = require('request');

var endpoint = 'http://localhost:9112'
function curlToHashgraph(message, callback) {
  if(message === null){
    request.post({
      uri: endpoint,
    }, function(err, res){
      if(err) {
        callback(err);
      }
      callback(null, res);
    });
  } else {
    request.post({
      uri: endpoint,
      form: message,
    }, function(err, res){
      if(err) {
        callback(err);
      }
      callback(null, res);
    });
  }
}

module.exports = {
  curlToHashgraph,
}