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
		'cost': {
			'travelCost': 0,
			'lodgingCost': 0,
			'totalCost': 0
		},
		'totals': {
			'distance': {
				'text': '0 mi',
				'value': 0
			},
			'duration': {
				'text': '0',
				'value': 0
			},
			'cost':  {
				'totalTripCost': 0
			}
		},
		'lodging': {}
	},

	initialize: function(opts) {
		if (!opts) { opts={}; }

		if (opts.url) { this.url = opts.url; }
	},

	startRemove: function(stopId) {
		this.set('isRemoving', true);

		//wait for animation
		_.delay(_.bind(function() {
			this.remove(stopId);	
		}, this), 400);
	},

	remove: function(stopId) {
		//collection deals with overhead
		this.trigger('removeStop', stopId);
	}
});

module.exports = stop_model;