var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});

module.exports.app = app;
routes = require('./routes');