//load config file
try {
	if (process.env.ISPROD) {
		var config = {
			dbConnectionString: process.env.dbConnectionString,
			ZilyoApiKey: process.env.ZilyoApiKey
		}
	} else {
		var config = require('../config');
	}
} catch(e) {
	console.log('error loading config', e);
	console.error('\033[31m config file is required! ' + 
		'Calls requiring DB lookups may not work.\033[0m');
	var config = { dbConnectionString: 'QuestBnB' }
}

var self 		= this;
var Promise 	= require('bluebird');
var _ 			= require('lodash');

//rendering 
var React 		= require('react');
var Renderer 	= require('../renderer/server_renderer');
var tripView 	= React.createFactory(require('../views/TripView.jsx'));

//db related utils
var mongojs 	= require('mongojs');
var db 			= mongojs(config.dbConnectionString);
var trips 		= db.collection('trips');

//bluebird promisify mongojs
Promise.promisifyAll(mongojs);

this.renderer = new Renderer();

var addObjIds = function(items) {
	_.each(items, function(item) {
		if ( !item._id || !mongojs.ObjectId.isValid(item._id) ) {
			item._id = mongojs.ObjectId().toJSON();
		}
	});
};

exports.create = function(req, res){
	var tripData = req.body;

	addObjIds(tripData.stops);
	addObjIds(tripData.travellers);

	trips.insertAsync(tripData).then(function(insertedDoc, err) {
		if (err) {
			res.status(500).send({'error': err});
		} else {
			insertedDoc[0].id = insertedDoc[0]._id.toJSON();
			res.send(insertedDoc[0]);
		}
	});
};

exports.get = function(req, res){
	var tripId = req.params.id;
	var objectId = mongojs.ObjectId;
	var doc;

	trips.findAsync({_id: objectId(tripId)}).then(function(docs) {
		if (docs && docs.length > 0) {
			
			doc = docs[0];
			
			_.extend(doc, { 
				mapStyleClasses: 'map trip-view'
			});

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
			res.status(404).send({'error': 'Trip document not found.'});
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

exports.edit = function(req, res){
	var tripId = req.params.id;
	var objectId = mongojs.ObjectId;
	var data = req.body;
	var doc;

	if (!data) { data = {}; }
	delete data._id;

	addObjIds(data.stops);
	addObjIds(data.travellers);

	trips.findAndModifyAsync({
		query: { _id: objectId(tripId) },
		update: data,
		new: true

	}).then(function(docs) {
		if (docs && docs.length > 0) {			
			doc = docs[0];
			
			res.status(200).send(doc);

		} else {
			res.status(404).send({'error': 'Trip document not found.'});
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