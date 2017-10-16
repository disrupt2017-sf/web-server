var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var endpoints = require('./endpoints');
var bodyParser = require('body-parser');
var hashgraph = require('./hashgraphFunctions');

require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors({}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/sendSMS', endpoints.sendSMS);

app.post('/receiveSMS', endpoints.receiveSMS);
// app.get('/receiveSMS', endpoints.receiveSMS);

app.post('/confirmSMS', endpoints.confirmSMS);

app.post('/geocode', endpoints.geoCode);

app.get('/hashgraphData', endpoints.getHashgraphData);
app.post('/hashgraphData', endpoints.writeToHashgraph);

app.post('/getSafeAlerts', endpoints.getSafeAlerts);

http.listen(3030, function(){
  console.log('listening on *:3030');
});

// io.on('connection', function(socket){
//   console.log('user connected');
//   setTimeout( function(){
//     hashgraph.curlToHashgraph(null, function(err, result){
//       if(err){
//         console.log(err);
//       }
//       console.log(result);
//       io.emit('updating data', result);
//     });
//   }, 5000);
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });