var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Promise = require("bluebird");
var _ = require('lodash');
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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var viewsPath = "./views/"

var landingView = React.createFactory(require(viewsPath + 'LandingView.jsx'));
var tripView = React.createFactory(require(viewsPath + 'TripView.jsx'));
var stopsView = React.createFactory(require(viewsPath + 'StopsView.jsx'));
var stopView = React.createFactory(require(viewsPath + 'StopView.jsx'));
var overviewView = React.createFactory(require(viewsPath + 'overviewView.jsx'));

this.renderer = new Renderer();

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
	var html = self.renderer.render(landingView, {
		mapStyleClasses: "map"
	});
	res.send(html);
});

app.post('/trips', function(req, res){
	var tripData = req.body;
	//TODO: validate data before passing it along

	addObjIds(tripData.stops);

	trips.insertAsync(tripData).then(function(insertedDoc, err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(insertedDoc[0]);
		}
	});
});

app.get('/trips/:id', function(req, res){
	var tripId = req.params.id;
	var wantsJSON = req.accepts('html', 'json') === 'json';
	var ObjectId = mongojs.ObjectId;
	var doc;

	trips.findAsync({_id: ObjectId(tripId)}).then(function(docs) {
		if (docs && docs.length > 0) {
			
			doc = docs[0];

			console.log("doc found: ", doc);
			
			_.extend(doc, {
				mapStyleClasses: "map trip-view"

			});

			if (wantsJSON) {
				res.send(doc);
			} else {
				var html = self.renderer.render(tripView, doc);
				res.send(html);
			}

		} else {
			res.sendStatus(404);
		}
		
	}).catch(function(e) {
		console.log("ERROR: ", e);
		res.sendStatus(500);
	});
	
});

app.put('/trips/:id', function(req, res) {
	var tripId = req.params.id;
	var ObjectId = mongojs.ObjectId;
	var data = req.body;

	delete data._id;

	addObjIds(data.stops);

	trips.findAndModifyAsync({
		query: { _id: ObjectId(tripId) },
		update: data,
		new: true

	}).then(function(docs) {
		if (docs && docs.length > 0) {			
			doc = docs[0];
			
			res.status(200).send(doc);

		} else {
			res.sendStatus(404);
		}
		
	}).catch(function(e) {
		console.log("ERROR: ", e);
		res.sendStatus(500);
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

var addObjIds = function(items) {
	_.each(items, function(item) {
		if ( !item._id || !mongojs.ObjectId.isValid(item._id) ) {
			item._id = mongojs.ObjectId();
		}
	});
}

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
