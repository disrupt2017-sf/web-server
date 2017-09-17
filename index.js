var app = require('express')();
var http = require('http').Server(app);
var endpoints = require('./endpoints');
var bodyParser = require('body-parser');

require('dotenv').config();

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

app.post('/geocode', endpoints.geoCode);

app.get('/hashgraphData', endpoints.getHashgraphData);
app.post('/hashgraphData', endpoints.writeToHashgraph);

http.listen(3000, function(){
  console.log('listening on *:3000');
});