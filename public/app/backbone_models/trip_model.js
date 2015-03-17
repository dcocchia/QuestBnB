var trip_model = Backbone.Model.extend({
	defaults: {
		start: "",
		end: "",
		tripLength: 0,
		tripDistance: 0,
		numStops: 0,
		cost: 0,
		travellers: [],
		stops: []
	},

	url: "/trips",

	initialize: function(opts) {

		console.log("trip model init");
	},

	setUrl: function(TripId) {
		this.url = this.url + "/" + TripId;
	},

	addStop: function(index, opts, silent) {
		var defaults = {
			location: "New Stop",
			stopNum: 1,
			dayNum: 1,
			milesNum: 0,
			isNew: false
		}

		var extendedOpts = _.defaults(opts, defaults);

		this.attributes.stops.splice(index, 0, extendedOpts);

		_.each(this.attributes.stops, function(stop, index) {
			stop.stopNum = index + 1;
		});

		if (silent !== true) {
			this.trigger("change");
		}

		_.delay(_.bind(this.setStopsActive, this), 400);
	},

	setStopsActive: function() {
		var shouldRender = false;

		_.each(this.attributes.stops, function(stop, index) {
			if (stop.isNew === true) {
				stop.isNew = false;
				shouldRender = true;
			}
			
		});

		if (shouldRender) {
			this.trigger("change");
		}
		
	}
});

module.exports = trip_model;