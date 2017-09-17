var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var endpoints = require('./endpoints');
var bodyParser = require('body-parser');
var net = require('net');
var ioc = require('socket.io-client');

require('dotenv').config();

var socket = ioc('http://localhost:9111');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/sendSMS', endpoints.sendSMS);

app.post('/receiveSMS', endpoints.receiveSMS);
app.get('/receiveSMS', endpoints.receiveSMS);

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

socket.on('connect', function(){
  console.log('Socket connected');
});

socket.on('event', function(data){
  console.log('something showed up');
  console.log(data);
});

socket.on('disconnect', function(){
  console.log('socket disconnected');
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});