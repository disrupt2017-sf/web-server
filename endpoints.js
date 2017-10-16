var nexmoFunctions = require('./nexmo/nexmoFunctions');
var AIParse = require('./AIFunctions');
var getCoordinates = require('./mapquestFunctions');
var hashgraph = require('./hashgraphFunctions');
var getCoordinates = require('./mapquestFunctions');
var determineCrisis = require('./utils/determineCrisis');
var getAritySafeAlerts = require('./arityFunctions');
var currentSessions = {};
var nextSession = 0;

function sendSMS (req, res) {
  nexmoFunctions.sendSMSToNexmo('something', function(){
    res.send('done');
  })
}

function receiveSMS (req, res) {
  console.log(currentSessions);
  var personId = req.body.msisdn;
  var timestamp = req.body['message-timestamp'];
  var personSession = currentSessions[personId] !== undefined ? currentSessions[personId] : { personId: personId, sessionId: nextSession };
  if(req.body.text === undefined){
    res.send(200).send();
  } else {
    if(req.body.text.match(/^\d+\w*\s*(?:[\-\/]?\s*)?\d*\s*\d+\/?\s*\d*\s*/) !== null){
      var local = req.body.text.replace(' ', '+');
      getCoordinates(local, function(err, coords){
        if(err){
          res.status(200).send(err);
        }
        var hashgraphData = {
          phoneNumber: personId,
          latitude: coords.lat,
          longitude: coords.lng,
          type: 'person',
          crisis: personSession.crisis,
          startTime: timestamp,
          status: 'open',
        };
        console.log('new data');
        console.log(hashgraphData);
        var dataString = JSON.stringify(hashgraphData);
        hashgraph.curlToHashgraph(`${dataString},`, function(err, resHash){
          if(err){
            res.status(200).send(err);
          }
          delete currentSessions[personId];
          nexmoFunctions.sendSMSToNexmo('Thanks for the info! We have someone on their way!', personId, function(err, result){
            if(err){
              console.log(err);
              res.status(200).send(err);
            } else {
              
              res.status(200).send('done');
            }
          });
        })
      })
    } else {
      AIParse(req.body.text, personSession.sessionId, function(err, aiRes){
        if(err){
          console.log(err);
          res.status(200).send(err);
        } else {
          // send SMS response
          if(aiRes.result.parameters != undefined && aiRes.result.parameters.fire != undefined){
            console.log('crisis is:');
            var crisis = determineCrisis(aiRes.result.resolvedQuery);
            console.log('result is');
            console.log(crisis);
            if(personSession.crisis == undefined){
              personSession.crisis = crisis;
            }
          }
          var aiResMessage = aiRes.result.fulfillment.speech != undefined ? aiRes.result.fulfillment.speech : 'Okay we should have someone to assist you shortly';
          if(aiRes.result.parameters != undefined && (aiRes.result.parameters.location != undefined || (aiRes.result.parameters['geo-city'] != '' && aiRes.result.parameters['geo-city'] != undefined) || (aiRes.result.parameters.imperilled != undefined && aiRes.result.parameters.imperilled == ''))) {
            console.log('writing to hashgraph');
            var locationString = aiRes.result.resolvedQuery.replace(' ', '+');
            console.log(aiRes.result);
            getCoordinates(locationString, function(err, coords){
              if(err){
                res.status(200).send(err);
              }
              var hashgraphData = {
                phoneNumber: personId,
                latitude: coords.lat,
                longitude: coords.lng,
                type: 'person',
                crisis: personSession.crisis,
                startTime: timestamp,
                status: 'open',
              };
              console.log('new data');
              console.log(hashgraphData);
              var dataString = JSON.stringify(hashgraphData);
              hashgraph.curlToHashgraph(`${dataString},`, function(err, resHash){
                if(err){
                  res.status(200).send(err);
                }
                delete currentSessions[personId];
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
            currentSessions[personId] = personSession;
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

function confirmSMS(req, res) {
  console.log('nice');
  res.status(200).json(result);
}

function getSafeAlerts(req, res){
  getAritySafeAlerts(req.body.lat, req.body.lng, 0.001, function(err, result){
    console.log(result);
    res.send(result);
  })
}

module.exports = {
  sendSMS,
  receiveSMS,
  geoCode,
  getHashgraphData,
  writeToHashgraph,
  confirmSMS,
  getSafeAlerts,
}