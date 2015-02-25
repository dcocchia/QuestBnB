var express = require('express');
var app = express();
var api = require("./lib/api");
var Promise = require("bluebird");
var mongojs = require('mongojs');
var db = mongojs('QuestBnB');
var trips = db.collection('trips');

//bluebird promisify mongojs
Promise.promisifyAll(mongojs);

//allows requiring in jsx files
//require('node-jsx').install({extension: '.jsx'});

//app.use(express.static(__dirname + '/'));

//app.use('/api', api.proxy);

app.get("/", function(req, res) {
	res.send("<!DOCTYPE html><html><head><title>Landing Page</title></head><body><h1>Landing Page</h1></body></html>");
});

app.get('/trips/:id', function(req, res){
	var tripId = parseInt(req.params.id);
	var wantsJSON = req.accepts('html', 'json') === 'json';

	trips.findAsync({id: tripId}).then(function(docs) {
		if (wantsJSON) {
			res.send(docs);
		} else {
			//TODO: need a renderer
			res.send("<!DOCTYPE html><html><head><title>Trip Page</title></head><body><h1>Trip Page</h1></body></html>");
		}
		
	}).catch(function(e) {
		res.sendStatus(500);
	});
	
});

app.put('/trips', function(req, res){
	var tripId = parseInt(req.params.id);
	var tripData = req.params.body;

	trips.findAsync({id: tripId}).then(function(docs) {

		if (docs && docs.length > 0) {
			res.sendStatus(500); //trip with that id already exists
		} else if (docs && docs.length <= 0) {
			//TODO: validation
			//send back the Trip ID
			trips.insertAsync(tripData.toJSON()).then(function() {
				res.send(200);
			});
		} else {
			res.sendStatus(500);
		}

	}).catch(function(e) {
		res.send(500);
	});
});

app.get('/trips/:id/stops', function(req, res) {
	res.send("<!DOCTYPE html><html><head><title>Stop Page</title></head><body><h1>Stops Page</h1></body></html>");
});

app.put('/trips/:id/stops', function(req, res) {

});

app.get('/trips/:id/stops/:id', function(req, res) {
	res.send("<!DOCTYPE html><html><head><title>Stop Page</title></head><body><h1>Stop Page</h1></body></html>");
});

app.patch('/trips/:id/stops/:id', function(req, res){

});

app.get("/trips/:id/overview", function(req, res) {
	var tripId = parseInt(req.params.id);

	res.send("<!DOCTYPE html><html><head><title>Overview Page</title></head><body><h1>Overview Page</h1></body></html>");
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

//api.listen(3010);