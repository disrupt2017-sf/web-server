var request = require('request');

function sendSMSToNexmo(message, number, callback) {
  var formData = {
    api_key: process.env.NEXMO_API_KEY,
    api_secret: process.env.NEXMO_API_SECRET,
    to: number,
    from: process.env.NEXMO_FROM,
    text: message
  };

  request.post({
    uri: 'https://rest.nexmo.com/sms/json',
    form: formData,
  }, function(err, res){
    if(err) {
      console.log(err);
      callback(err);
    }
    callback(null, res);
  });
}

function curlToHashgraph(message, callback) {
  request.post({
    uri: 'http://localhost:9111',
    form: 'some data',
  }, function(err, res){
    if(err) {
      callback(err);
    }
    callback(null, res);
  })
}

module.exports = {
  sendSMSToNexmo,
  curlToHashgraph,
}