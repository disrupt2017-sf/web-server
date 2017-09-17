var nexmoFunctions = require('./nexmo/nexmoFunctions');
var AIParse = require('./AIFunctions');

function sendSMS (req, res) {
  nexmoFunctions.sendSMSToNexmo('something', function(){
    console.log('done');
    res.send('done');
  })
}

function receiveSMS (req, res) {
  console.log('i got hit');
  console.log(req.body);
  AIParse(req.body.text, function(err, aiRes){
    console.log(aiRes);
    res.status(200).send();
  })
}

module.exports = {
  sendSMS,
  receiveSMS,
}