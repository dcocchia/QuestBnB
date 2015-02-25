var express = require('express');
var app = express();
var api = require("./lib/api");
var Promise = require("bluebird");
var mongojs = require('mongojs');
var db = mongojs('QuestBnB');
var trips = db.collection('trips');
var port = process.env.PORT || 3000;
var React = require('react');
var Renderer = require('./renderer/server_renderer');
var self = this;

//bluebird promisify mongojs
Promise.promisifyAll(mongojs);

//allows requiring in jsx files
require('node-jsx').install({extension: '.jsx'});

var landingView = React.createFactory(require('./views/LandingView.jsx'));
var tripView = React.createFactory(require('./views/TripView.jsx'));
var stopsView = React.createFactory(require('./views/StopsView.jsx'));
var stopView = React.createFactory(require('./views/StopView.jsx'));
var overviewView = React.createFactory(require('./views/overviewView.jsx'));

this.renderer = new Renderer();

app.use(express.static(__dirname + '/public'));

//app.use('/api', api.proxy);

app.get("/", function(req, res) {
	var html = self.renderer.render(landingView, {
		title: "Landing Page"
	});
	res.send(html);
});

app.get('/trips/:id', function(req, res){
	var tripId = parseInt(req.params.id);
	var wantsJSON = req.accepts('html', 'json') === 'json';

	trips.findAsync({id: tripId}).then(function(docs) {
		if (wantsJSON) {
			res.send(docs);
		} else {
			var html = self.renderer.render(tripView, {
				title: "Trip Page",
				data: docs[0]
			});
			res.send(html);
		}
		
	}).catch(function(e) {
		console.log("ERROR: ", e);
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
	var html = self.renderer.render(stopsView, {
		title: "Stops Page"
	});
	res.send(html);
});

app.put('/trips/:id/stops', function(req, res) {

});

app.get('/trips/:id/stops/:id', function(req, res) {
	var html = self.renderer.render(stopsView, {
		title: "Stop Page"
	});
	res.send(html);
});

app.patch('/trips/:id/stops/:id', function(req, res){

});

app.get("/trips/:id/overview", function(req, res) {
	var html = self.renderer.render(overviewView, {
		title: "Overview Page"
	});
	res.send(html);
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
