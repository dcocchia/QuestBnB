var stop_model = require("../backbone_models/stop_model");

var stops_colletion = Backbone.Collection.extend({
	model: stop_model,

	initialize: function(opts) {},

	addStop: function(index, opts, silent) {
		var newStopModel = new stop_model(opts);
		
		this.add(newStopModel, {
			at: index
		});

		_.each(this.models, function(stop, index) {
			stop.attributes.stopNum = index + 1;
		});

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
				returnedStop = thisStop;
				thisStopModel = stop;
			}
			
		});

		thisStopModel.trigger("active");

		if (returnedStop) {
			this.trigger("change", returnedStop);
		}
	},

	mergeMapData: function(result) {
		var thisStop;
		var lastStop;
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

					thisStop.distance = { 
						text: thisLeg.distance.text,
						value: thisLeg.distance.value
					}

					thisStop.duration = { 
						text: thisLeg.duration.text,
						value: thisLeg.duration.value
					}

					thisStop.totals = {
						distance: { 
							value: lastStop.totals.distance.value + thisLeg.distance.value,
							text: (lastStop.totals.distance.value + thisLeg.distance.value).toString()
						},
						duration: {
							value: lastStop.totals.duration.value + thisLeg.duration.value,
							text: (lastStop.totals.duration.value + thisLeg.duration.value).toString()
						}
					}
				}

			}, this));

		}
	}
});

module.exports = stops_colletion;