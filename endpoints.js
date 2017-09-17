var nexmoFunctions = require('./nexmo/nexmoFunctions');
var AIParse = require('./AIFunctions');
var getCoordinates = require('./mapquestFunctions');
var hashgraph = require('./hashgraphFunctions');
var getCoordinates = require('./mapquestFunctions');
var determineCrisis = require('./utils/determineCrisis');
var currentSessions = {};
var nextSession = 0;

function sendSMS (req, res) {
  nexmoFunctions.sendSMSToNexmo('something', function(){
    res.send('done');
  })
}

function receiveSMS (req, res) {
  var personId = req.body.msisdn;
  var timestamp = req.body['message-timestamp'];
  var personSession = currentSessions[personId] !== undefined ? currentSessions[personId] : { personId: personId, sessionId: nextSession };
  console.log(req.body);
  if(req.body.text === undefined){
    res.send(200).send();
  } else {
    AIParse(req.body.text, personSession.sessionId, function(err, aiRes){
      if(err){
        console.log(err);
        res.status(200).send(err);
      } else {
        console.log('aiRes: ');
        console.log(aiRes);
        // send SMS response
        var aiResMessage = aiRes.result.fulfillment.speech != undefined ? aiRes.result.fulfillment.speech : 'Okay we should have someone to assist you shortly';
        if(aiRes.result.parameters != undefined && (aiRes.result.parameters.location != undefined || (aiRes.result.parameters['geo-city'] != '' && aiRes.result.parameters['geo-city'] != undefined) || (aiRes.result.parameters.imperilled != undefined && aiRes.result.parameters.imperilled == ''))) {
          console.log('writing to hashgraph');
          var locationString = aiRes.result.resolvedQuery.replace(' ', '+');
          var crisis = determineCrisis(aiRes.result.resolvedQuery);
          getCoordinates(locationString, function(err, coords){
            if(err){
              res.status(200).send(err);
            }
            var hashgraphData = {
              phoneNumber: personId,
              latitude: coords.lat,
              longitude: coords.lng,
              type: 'person',
              crisis: crisis,
              startTime: timestamp,
              status: 'open',
            };
            var dataString = JSON.stringify(hashgraphData);
            hashgraph.curlToHashgraph(`${dataString},`, function(err, resHash){
              if(err){
                res.status(200).send(err);
              }
              nexmoFunctions.sendSMSToNexmo(aiResMessage, personId, function(err, result){
                if(err){
                  console.log(err);
                  res.status(200).send(err);
                } else {
                  res.status(200).send('done');
                }
              });
            })
          });
        } else {
          console.log('nothing written');
          nexmoFunctions.sendSMSToNexmo(aiResMessage, personId, function(err, result){
            if(err){
              console.log(err);
              res.status(200).send(err);
            } else {
              res.status(200).send('done');
            }
          });
        }
      }
    })
  }
}

function geoCode(req, res) {
  getCoordinates(req.body.location, function(err, result){
    if(err){
      console.log(err);
      res.send(err);
    }
    res.status(200).json(result);
  });
}

function getHashgraphData(req, res) {
  hashgraph.curlToHashgraph(null, function(err, result){
    if(err){
      console.log('some err', err);
      res.send(err);
    }
    var final = result.body.replace(/\r?\n|\r/g, '');
    final = final.substring(0, final.length-1);
    console.log(final);
    res.send(`[${final}]`);
  });
}

function writeToHashgraph(req, res) {
  console.log('data written', req.body.data);
  hashgraph.curlToHashgraph(req.body.data, function(err, result){
    if(err){
      console.log('some err', err);
      res.send(err);
    }
    res.json(result);
  });
}

module.exports = {
  sendSMS,
  receiveSMS,
  geoCode,
  getHashgraphData,
  writeToHashgraph,
}