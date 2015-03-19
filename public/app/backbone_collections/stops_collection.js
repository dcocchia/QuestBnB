var stop_model = require("../backbone_models/stop_model");

var stops_colletion = Backbone.Collection.extend({
	model: stop_model,

	initialize: function(opts) {

		console.log("stop collection init");
	},

	addStop: function(index, opts, silent) {
		var newStopModel = new stop_model(opts);
		
		this.models.splice(index, 0, newStopModel);

		_.each(this.models, function(stop, index) {
			stop.attributes.stopNum = index + 1;
		});

		if (silent !== true) {
			this.trigger("change");
		}

		_.delay(_.bind(this.setStopsActive, this), 400);
	},

	setStopsActive: function() {
		var shouldRender = false;
		var returnedStop;

		_.each(this.models, function(stop, index) {
			stop = stop.attributes;

			if (stop.isNew === true) {
				stop.isNew = false;
				shouldRender = true;
				returnedStop = stop;
			}
			
		});

		if (shouldRender) {
			this.trigger("change", returnedStop);
		}
	}
});

module.exports = stops_colletion;