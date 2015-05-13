//load config file
try {
	var config = require('../config');
} catch(e) {
	console.log('error loading config', e);
	console.error('\033[31m config file is required! ' + 
		'Calls to /lodgings will not work.\033[0m');
}

var Promise = require('bluebird');
var _ 		= require('lodash');
var request = require('request');

exports.get = function(req, res) {
	var resultDesc;

	var queryDefaults = {
		provider: 'airbnb'
	};

	var queries = _.defaults(req.query , queryDefaults);

	var options = {
		url: 'https://zilyo.p.mashape.com/search',
		headers: {
			'X-Mashape-Key'	:	config.ZilyoApiKey,
			'Accept'		:	'application/json'
		},
		qs: queries
	};

	var countOptions = _.defaults({
		url: 'https://zilyo.p.mashape.com/count'
	}, options);

	var reqPromise = new Promise(_.bind(function(resolve, reject) {
		request(options, function(error, response, body) {
			if (!error){ 
				resolve(JSON.parse(body)); 
			} else {
				reject(error);
			}
		});
	}, this));

	var countPromise = new Promise(_.bind(function(resolve, reject) {
		request(countOptions, function(error, response, body) {
			if (!error){ 
				resolve(JSON.parse(body)); 
			} else {
				reject(error);
			}
		});
	}, this));

	Promise.all([reqPromise, countPromise]).then( _.bind(function(resps){
		//add shortDesc to each result
		_.each(resps[0].result, function(result) {
			resultDesc = result.attr.description;

			if (!resultDesc || resultDesc.length < 225) { return; }

			result.attr.shortDesc = resultDesc.substring(0, 225);

			if (resultDesc.length > 225) {
				result.attr.shortDesc += '...';
			}
		});

		resps[0].count = resps[1].result;
		res.send(resps[0]);
	}, this));
};