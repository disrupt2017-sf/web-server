var request = require('request');

function sendSMSToNexmo(message, callback) {
  console.log('sending sms');
  var formData = {
    api_key: process.env.NEXMO_API_KEY,
    api_secret: process.env.NEXMO_API_SECRET,
    to: '16177687993',
    from: process.env.NEXMO_FROM,
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