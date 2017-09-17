var nexmoFunctions = require('./nexmo/nexmoFunctions');

function sendSMS (req, res) {
  nexmoFunctions.sendSMSToNexmo('something', function(){
    console.log('done');
    res.send('done');
  })
}

function receiveSMS (req, res) {
  console.log('i got hit');
  console.log(req.body);
  res.status(200).send();
}

module.exports = {
  sendSMS,
  receiveSMS,
}