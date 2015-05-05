var stop_model = Backbone.Model.extend({
	defaults: {
		'location': '',
		'stopNum': 1,
		'dayNum': 1,
		'distance': {
			'text': '0 mi',
			'value': 0
		},
		'duration': {
			'text': '0',
			'value': 0
		},
		'totals': {
			'distance': {
				'text': '0 mi',
				'value': 0
			},
			'duration': {
				'text': '0',
				'value': 0
			}
		},
		'lodging': {}
	},

	initialize: function(opts) {
		if (!opts) { opts={}; }

		if (opts.url) { this.url = opts.url; }
	},

	remove: function(stopId) {
		//collection deals with overhead
		this.trigger('removeStop', stopId);
	}
});

module.exports = stop_model;