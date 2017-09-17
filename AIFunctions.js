var apiai = require('apiai');

var app = apiai('33ea78ce776e47a3be419e8cb7956f27');

function AIParse(message, sessionId, callback) {
  console.log('testing message:', message)
  if(message === undefined) {
    callback('no message found');
  } else {
    var request = app.textRequest(message, {
      sessionId: sessionId
    });

    request.on('response', function(response) {
      console.log(response);
      callback(null, response);
    });

    request.on('error', function(error) {
      console.log(error);
      callback(error);
    });

    request.end();
  }
}

module.exports = AIParse;