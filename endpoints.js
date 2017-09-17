var nexmoFunctions = require('./nexmo/nexmoFunctions');
var AIParse = require('./AIFunctions');
var getCoordinates = require('./mapquestFunctions');

var currentSessions = {};
var nextSession = 0;

function sendSMS (req, res) {
  nexmoFunctions.sendSMSToNexmo('something', function(){
    console.log('done');
    res.send('done');
  })
}

function receiveSMS (req, res) {
  console.log('i got hit');
  console.log(req.body);
  // check to see if this is a new person
  // if ()
  // if new person give them next session number
  console.log('parsing ai');
  var personId = req.body.msisdn;
  var personSession = currentSessions[personId] !== undefined ? currentSessions[personId] : { personId: personId, sessionId: nextSession };
  AIParse(req.body.text, personSession.sessionId, function(err, aiRes){
    console.log(aiRes);
    if(err){
      console.log(err);
      res.status(200).send(err);
    } else {

      // send SMS response
      console.log('sending sms');
      nexmoFunctions.sendSMSToNexmo(aiRes.result.fulfillment.speech, function(err, result){
        if(err){
          console.log(err);
          res.status(200).send(err);
        } else {
          console.log('successful');
          res.status(200).send('done');
        }
      });
    }
  })
}

function geoCode(req, res) {
  console.log('body is');
  console.log(req.body);
  getCoordinates(req.body.location, function(err, result){
    if(err){
      console.log(err);
    }
    res.status(200).json(result);
  });
}

module.exports = {
  sendSMS,
  receiveSMS,
  geoCode,
}