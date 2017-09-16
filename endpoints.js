var nexmoFunctions = require('./nexmo/nexmoFunctions');

function sendSMS (req, res) {
  nexmoFunctions.sendSMSToNexmo('something', function(){
    console.log('done');
    res.send('done');
  })
}

module.exports = {
  sendSMS,
}