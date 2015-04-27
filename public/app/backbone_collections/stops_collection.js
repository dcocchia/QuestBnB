var moment = require('moment');
require('moment-duration-format');
var stop_model = require('../backbone_models/stop_model');

var stops_colletion = Backbone.Collection.extend({
	model: stop_model,

	_numberStops: function() {
		_.each(this.models, function(stop, index) {
			stop.set('stopNum', {index: index + 1}, {silent: true});
		});
	},

	initialize: function() {
		this.on('removeStop', _.bind(function(stopId) {
			this.removeStop(stopId);
		}, this));
	},

	getStop: function(stopId) {
		return _.find(this.models, function(stopModel) {
			 return (stopModel.get('_id') === stopId);
		});
	},

	addStop: function(index, opts) {
		var newStopModel = new stop_model(opts);
		
		this.add(newStopModel, {
			at: index
		});

		this._numberStops();

		//lets trip_view's trip_model know to update list of stops
		this.trigger('change', newStopModel);
		_.delay(_.bind(this.setStopsActive, this), 450);
	},

	setStopsActive: function() {
		var returnedStop, thisStop;

		_.each(this.models, function(stop) {
			thisStop = stop.attributes;

			if (thisStop.isNew === true) {
				thisStop.isNew = false;
				returnedStop = stop;
			}
			
		});

		if (returnedStop) { 
			returnedStop.trigger('active');
			this.trigger('change', returnedStop); 
		}
	},

	removeStop: function(stopId) {
		this.remove( this.where({_id: stopId}) );
		this._numberStops();
		this.trigger('change');

		//listeners will destroy related view
		Backbone.trigger('removeStop', stopId);
	},

	mergeMapData: function(result) {
		var METERCONVERT = 1609.344;
		var DURATIONFORMAT = 'y [years] d [days] h [hours] m [mins]';
		var lastStop, totalDistance, totalDuration, legs, thisLeg;
		var legDistance, lastStopDistance;
		var legDuration, lastStopDuration;

		var stopDefaults = {
			distance: {
				text: '0',
				value: 0
			},
			duration: {
				text: '0',
				value: 0
			},
			totals: {
				distance: {
					text: '0',
					value: 0
				},
				duration: {
					text: '0',
					value: 0
				}
			},
			end_location: {
				lat: function() { return 0; },
				lng: function() { return 0; }
			},
			start_location: {
				lat: function() { return 0; },
				lng: function() { return 0; }
			}
		};

		if (!result) { result = {}; }
		if (!result.routes) { result.routes = [{legs:[]}]; }
		legs = result.routes[0].legs;

		if (legs.length !== this.models.length - 1) { return; }

		_.each(this.models, _.bind(function(stop, index) {
			if (index > 0) {
				//bad model
				if (!stop || !stop.set || !stop.attributes) { return; }
				
				lastStop = this.models[index - 1].attributes;
				thisLeg = legs[index - 1];
				thisLeg = function() {
					if (!thisLeg || _.isEmpty(thisLeg) ) {
						return stopDefaults;
					} else {
						return thisLeg;
					}
				}();

				legDistance = thisLeg.distance.value / METERCONVERT;
				lastStopDistance = lastStop.totals.distance.value;
				totalDistance = Math.round(lastStopDistance + legDistance);

				legDuration = thisLeg.duration.value;
				lastStopDuration = lastStop.totals.duration.value;
				totalDuration =  lastStopDuration + legDuration;
				
				stop.set('geo', {
					lat: thisLeg.end_location.lat(),
					lng: thisLeg.end_location.lng()
				}, {silent: true});

				stop.set('distance', { 
					text: thisLeg.distance.text,
					value: thisLeg.distance.value
				}, {silent: true});

				stop.set('duration', {
					text: thisLeg.duration.text,
					value: thisLeg.duration.value
				}, {silent: true});

				//NOTE: backbone does not do deep/nested models
				//Since I'm setting the models above silently, 
				//I'm ok with directly affecting attributes here
				stop.attributes.totals = {
					distance: { 
						value: totalDistance,
						text: totalDistance.toString() + ' mi'
					},
					duration: {
						value: totalDuration,
						text: moment.duration(totalDuration, 'seconds')
								.format(DURATIONFORMAT)
					}
				};
			} else {
				thisLeg = legs[0];
				thisLeg = function() {
					if (!thisLeg || _.isEmpty(thisLeg) ) {
						return stopDefaults;
					} else {
						return thisLeg;
					}
				}();
				_.first(this.models).set('geo', {
					lat: thisLeg.start_location.lat(),
					lng: thisLeg.start_location.lng()
				}, {silent: true});
			}
		}, this));
	}
});

module.exports = stops_colletion;