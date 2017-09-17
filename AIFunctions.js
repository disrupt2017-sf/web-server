var apiai = require('apiai');

var app = apiai('33ea78ce776e47a3be419e8cb7956f27');

function AIParse(message, callback) {
  var request = app.textRequest('Test me', {
    sessionId: '1'
  });

  request.on('response', function(response) {
    console.log(response);
    callback(null, response);
  });

  request.on('error', function(error) {
    console.log(error);
  });

  request.end();
}

module.exports = AIParse;