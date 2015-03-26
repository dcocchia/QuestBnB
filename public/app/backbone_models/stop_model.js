var stop_model = Backbone.Model.extend({
	defaults: {
		"location": "",
		"stopNum": 1,
		"dayNum": 1,
		"distance": {
			"text": "0 mi",
			"value": 0
		},
		"duration": {
			"text": "0",
			"value": 0
		},
		"totals": {
			"distance": {
				"text": "0 mi",
				"value": 0
			},
			"duration": {
				"text": "0",
				"value": 0
			}
		}
	},

	initialize: function(opts) {}
});

module.exports = stop_model;