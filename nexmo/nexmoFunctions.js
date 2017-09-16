var request = require('request');

function sendSMSToNexmo(message, callback) {
  console.log('sending sms');
  var formData = {
    api_key: '2541e871',
    api_secret: '0a044b954bc8b886',
    to: '16177687993',
    from: '12016728498',
    text: 'Hello from Nexmo'
  };

  request.post({
    uri: 'https://rest.nexmo.com/sms/json',
    form: formData,
  }, function(err, res){
    if(err) {
      console.log(err);
      callback(err);
    }
    console.log(res);
    callback(null, res);
  });
}

module.exports = {
  sendSMSToNexmo,
}