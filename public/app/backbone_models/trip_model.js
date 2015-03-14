var trip_model = Backbone.Model.extend({
	defaults: {
		start: "",
		end: "",
		tripLength: 0,
		tripDistance: 0,
		numStops: 0,
		cost: 0,
		travellers: [],
		stops: [],
		blurbs: []
	},

	url: "/trips",

	initialize: function(opts) {

		console.log("trip model init");
	}
});

module.exports = trip_model;