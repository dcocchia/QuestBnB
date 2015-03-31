var trip_model = Backbone.Model.extend({
	defaults: {
		start: "",
		end: "",
		tripLength: 0,
		tripDuration: 0,
		numStops: 0,
		cost: 0,
		mpg: 25,
		gasPrice: 3.50,
		travellers: [],
		stops: []
	},

	url: "/trips",

	initialize: function(opts) {
	},

	setUrl: function(TripId) {
		this.url = this.url + "/" + TripId;
	}
});

module.exports = trip_model;