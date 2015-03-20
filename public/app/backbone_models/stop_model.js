var stop_model = Backbone.Model.extend({
	defaults: {
		"location": "",
		"stopNum": 1,
		"dayNum": 1,
		"milesNum": 0
	},

	initialize: function(opts) {
	}
});

module.exports = stop_model;