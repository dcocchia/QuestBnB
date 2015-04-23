try {
	var config = require("./config");
} catch(e) {
	console.log("error loading config", e);
	console.error("\033[31m config file is required! Calls to /lodgings will not work.\033[0m");
}
var express = require('express');
var request = require('request');
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
	addObjIds(tripData.travellers);

	trips.insertAsync(tripData).then(function(insertedDoc, err) {
		if (err) {
			res.status(500).send({"error": error});
		} else {
			res.send(insertedDoc[0]);
		}
	});
});

app.get('/trips/:id', function(req, res){
	var tripId = req.params.id;
	var ObjectId = mongojs.ObjectId;
	var doc;

	trips.findAsync({_id: ObjectId(tripId)}).then(function(docs) {
		if (docs && docs.length > 0) {
			
			doc = docs[0];
			
			_.extend(doc, { mapStyleClasses: "map trip-view" });

			res.format({
				json: function() {
					res.send(doc);
				},
				html: function() {
					var html = self.renderer.render(tripView, doc);
					res.send(html);
				}
			});

		} else {
			res.status(404).send({"error": "Trip document not found."});
		}
		
	}).catch(function(e) {
		res.status(500).send({"error": e});
	});
	
});

app.put('/trips/:id', function(req, res) {
	var tripId = req.params.id;
	var ObjectId = mongojs.ObjectId;
	var data = req.body;
	var doc;

	data || (data = {});
	delete data._id;

	addObjIds(data.stops);
	addObjIds(data.travellers);

	trips.findAndModifyAsync({
		query: { _id: ObjectId(tripId) },
		update: data,
		new: true

	}).then(function(docs) {
		if (docs && docs.length > 0) {			
			doc = docs[0];
			
			res.status(200).send(doc);

		} else {
			res.status(404).send({"error": e});
		}
		
	}).catch(function(e) {
		res.status(500).send({"error": e});
	});
});

app.get('/trips/:id/stops/:stopId', function(req, res) {
	var ObjectId = mongojs.ObjectId;
	var tripId = req.params.id;
	var stopId = req.params.stopId;
	var stopDoc;

	trips.findAsync({_id: ObjectId(tripId)}).then(function(docs) {
		if (docs && docs.length > 0) {
			
			doc = docs[0];

			stopDoc = _.find(doc.stops, function(stop) {
				return (stop._id === stopId);
			});

			_.extend(stopDoc, {
				tripTitle: doc.title,
				mapStyleClasses: "map stop-view"
			});

			res.format({
				json: function() {
					res.send(stopDoc);
				},
				html: function() {
					getLodgings(stopDoc.geo, req.headers.host, req.query).then(_.bind(function(lodgingData) {
						stopDoc.lodgingData = lodgingData;
						var html = self.renderer.render(stopView, stopDoc);
						res.send(html);
					}, this));
				}
			});

		} else {
			res.status(404).send({"error": "Stop document not found."});
		}
		
	}).catch(function(e) {
		res.status(500).send({"error": e});
	});
});

app.put('/trips/:id/stops/:stopId', function(req, res) {

});

app.get('/lodgings', function(req, res) {
	var queryDefaults = {
		provider: "airbnb"
	};

	var queries = _.defaults(req.query , queryDefaults);

	var options = {
		url: "https://zilyo.p.mashape.com/search",
		headers: {
			"X-Mashape-Key"	:	config.ZilyoApiKey,
			"Accept"		:	"application/json"
		},
		qs: queries
	};

	req.pipe(request(options)).pipe(res);
});

var addObjIds = function(items) {
	_.each(items, function(item) {
		if ( !item._id || !mongojs.ObjectId.isValid(item._id) ) {
			item._id = mongojs.ObjectId();
		}
	});
}

var getLodgings = function(geo, host, queries) {
	//TODO: this is messy. Should figure out clean way to call own route
	var queryDefaults = {
		provider: "airbnb",
		resultsperpage: 20,
		latitude: geo.lat,
		longitude: geo.lng
	};

	var searchQueries = _.defaults(queries, queryDefaults);

	var reqPromise = new Promise(_.bind(function(resolve, reject) {
		request({
			url: "http://" + host + "/lodgings",
			qs: searchQueries
		}, function(error, response, body){
			if (error) {
				reject(error);
			} else {
				resolve(JSON.parse(body));
			}
		});
	}, this));

	return reqPromise;
}

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
