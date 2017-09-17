var request = require('request');

function curlToHashgraph(message, callback) {
  console.log('writing');
  console.log(message);
  if(message === null){
    request.post({
      uri: 'http://localhost:9111',
    }, function(err, res){
      if(err) {
        callback(err);
      }
      callback(null, res);
    });
  } else {
    request.post({
      uri: 'http://localhost:9111',
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