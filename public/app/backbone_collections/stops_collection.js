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
	}
});

module.exports = stops_colletion;