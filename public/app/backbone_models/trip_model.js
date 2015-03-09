var trip_model = Backbone.Model.extend({
	defaults: {
		start: "",
		end: "",
		travellers: [],
		stops: []
	},

	initialize: function(opts) {

		console.log("trip model init");
	}
});

module.exports = trip_model;