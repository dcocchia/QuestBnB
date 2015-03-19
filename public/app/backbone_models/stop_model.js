var stop_model = Backbone.Model.extend({
	defaults: {
		"location": "Home",
		"stopNum": 1,
		"dayNum": 1,
		"milesNum": 0
	},

	initialize: function(opts) {

		console.log("stop model init");
	}
});

module.exports = stop_model;