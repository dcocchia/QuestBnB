var stop_model = require("../backbone_models/stop_model");

var stops_colletion = Backbone.Collection.extend({
	model: stop_model,

	_numberStops: function() {
		_.each(this.models, function(stop, index) {
			stop.set("stopNum", {index: index + 1}, {silent: true});
		});
	},

	initialize: function(opts) {
		this.on("removeStop", _.bind(function(stopId) {
			this.removeStop(stopId);
		}, this));
	},

	addStop: function(index, opts) {
		var newStopModel = new stop_model(opts);
		
		this.add(newStopModel, {
			at: index
		});

		this._numberStops();

		//lets trip_view's trip_model know to update list of stops
		this.trigger("change", newStopModel);
		_.delay(_.bind(this.setStopsActive, this), 450);
	},

	setStopsActive: function() {
		var returnedStop, thisStop, thisStopModel;

		_.each(this.models, function(stop, index) {
			thisStop = stop.attributes;

			if (thisStop.isNew === true) {
				thisStop.isNew = false;
				returnedStop = stop;
				thisStopModel = stop;
			}
			
		});

		thisStopModel.trigger("active");

		if (returnedStop) {
			this.trigger("change", returnedStop);
		}
	},

	removeStop: function(stopId, opts) {
		this.remove( this.where({_id: stopId}) );
		this._numberStops();
		this.trigger("change");

		//listeners will destroy related view
		Backbone.trigger("removeStop", stopId);
	},

	mergeMapData: function(result) {
		var METERCONVERT = 1609.344;
		var thisStop;
		var lastStop;
		var totalDistance;
		var totalDuration;
		var legs;
		var thisLeg;

		var lastStopDefaults = {
			distance: {
				text: "0",
				value: 0
			},
			duration: {
				text: "0",
				value: 0
			},
			totals: {
				distance: {
					text: "0",
					value: 0
				},
				duration: {
					text: "0",
					value: 0
				}
			}
		}

		result || (result = {});
		result.routes || (result.routes = [{legs:[]}]);
		legs = result.routes[0].legs;

		if (legs.length === this.models.length - 1) {

			_.each(this.models, _.bind(function(stop, index) {
				if (index > 0) {
					lastStop = (this.models[index - 1] ? this.models[index - 1].attributes : lastStopDefaults);
					thisStop = stop.attributes;
					thisLeg = legs[index - 1];

					totalDistance = Math.round(lastStop.totals.distance.value + (thisLeg.distance.value / METERCONVERT));
					totalDuration = lastStop.totals.duration.value + thisLeg.duration.value;

					stop.set("distance", { 
						text: thisLeg.distance.text,
						value: thisLeg.distance.value
					}, {silent: true});

					stop.set("duration", {
						text: thisLeg.duration.text,
						value: thisLeg.duration.value
					}, {silent: true});

					//NOTE: backbone does not do deep/nested models
					//Since I'm setting the models above silently, I'm ok with directly affecting attributes here
					stop.attributes.totals = {
						distance: { 
							value: totalDistance,
							text: totalDistance.toString() + " mi"
						},
						duration: {
							value: totalDuration,
							text: moment.duration(totalDuration, "seconds").format("y [years] d [days] h [hours] m [mins]")
						}
					};
				}
			}, this));
		}
	}
});

module.exports = stops_colletion;