//load config file
try {
	if (process.env.ISPROD) {
		var config = {
			dbConnectionString: process.env.dbConnectionString,
			ZilyoApiKey: process.env.ZilyoApiKey
		};
	} else {
		var config = require('../config');
	}
} catch(e) {
	console.log('error loading config', e);
	console.error('\033[31m config file is required! ' + 
		'Calls requiring DB lookups may not work.\033[0m');
	var config = { dbConnectionString: 'QuestBnB' };
}

var self 		= this;
var Promise 	= require('bluebird');
var _ 			= require('lodash');
var request 	= require('request');

//rendering 
var React		= require('react');
var Renderer 	= require('../renderer/server_renderer');
var stopView 	= React.createFactory(require('../views/StopView.jsx'));

//db related utils
var mongojs 	= require('mongojs');
var db 			= mongojs(config.dbConnectionString);
var trips 		= db.collection('trips');

//bluebird promisify mongojs
Promise.promisifyAll(mongojs);

this.renderer = new Renderer();

var getLodgings = function(geo, host, queries) {
	var queryDefaults = {
		provider: 'airbnb',
		resultsperpage: 20,
		latitude: geo.lat,
		longitude: geo.lng
	};

	var searchQueries = _.defaults(queries, queryDefaults);

	var reqPromise = new Promise(_.bind(function(resolve, reject) {
		request({
			url: 'http://' + host + '/lodgings',
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
};

exports.get = function(req, res){
	var objectId = mongojs.ObjectId;
	var tripId = req.params.id;
	var stopId = req.params.stopId;
	var stopDoc;
	var thisStopId;
	var doc;

	trips.findAsync({_id: objectId(tripId)}).then(function(docs) {
		if (docs && docs.length > 0) {
			
			doc = docs[0];

			stopDoc = _.find(doc.stops, function(stop) {
				if (stop._id instanceof mongojs.ObjectId) {
					thisStopId = stop._id.toJSON();
				} else {
					thisStopId = stop._id;
				}

				return (thisStopId === stopId);
			});

			if (!stopDoc) {
				res.status(404).send('<p>This stop could not be found.</p>');
			}

			_.extend(stopDoc, {
				pageName: '/stops',
				title: doc.title + ' &#8211; Stop ' + stopDoc.stopNum.index,
				tripTitle: doc.title,
				tripId: tripId,
				mapStyleClasses: 'map stop-view',
				isServer: true,
				start: doc.start,
				end: doc.end
			});

			res.format({
				json: function() {
					res.send(stopDoc);
				},
				html: function() {
					getLodgings(stopDoc.geo, req.headers.host, req.query)
						.then(_.bind(function(lodgingData) {
							stopDoc.lodgingData = lodgingData;
							var html = self.renderer.render(stopView, stopDoc);
							res.send(html);
						}, this));
				}
			});

		} else {
			res.status(404).send({'error': 'Stop document not found.'});
		}
		
	}).catch(function(e) {
		res.status(500).send({
			'error': {
				'message: ': e.message, 
				'stack trace: ': e.stack
			}
		});
	});
};

exports.create = function(req, res){
	var tripId = req.params.id;
	var stopId = req.params.stopId;
	var objectId = mongojs.ObjectId;
	var data = req.body;
	var doc;
	var stopIndex = 0;

	if (!data) {
		res.status(500).send({'error': 'No data sent'});
		return;
	}

	trips.findAsync({_id: objectId(tripId)})
		.then(function(docs) {
			if (docs && docs.length > 0) {			
				doc = docs[0];

				_.find(doc.stops, function(stop, index) {
					if (stop._id === stopId) {
						_.defaults(data, doc.stops[index]);
						doc.stops[index] = data;
						doc.stops[index].tripTitle = doc.title;
						stopIndex = index;
						return true;
					}
				});

				trips.findAndModifyAsync({
					query: { _id: objectId(tripId) },
					update: doc,
					new: true
				}).then(function(updatedDocs) {
					res.send(updatedDocs[0].stops[stopIndex]);
				}).catch(function(e) {
					res.status(500).send({
						'error': {
							'message: ': e.message, 
							'stack trace: ': e.stack
						}
					});
				});

			} else {
				res.status(404).send('<p>This stop could not be found.</p>');
			}
		}).catch(function(e) {
			res.status(500).send({
				'error': {
					'message: ': e.message, 
					'stack trace: ': e.stack
				}
			});
		});
};