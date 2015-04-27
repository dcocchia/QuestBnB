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
		'lodging': {
		    'id': 'abc123',
		    'latLng': [
				0,
		        0
		    ],
		    'itemStatus': 'published',
		    'attr': {
		        'roomType': {
		            'text': 'Entire home/apt',
		            'id': 0
		        },
		        'bathrooms': 1,
		        'description': '',
		        'instantBookable': false,
		        'extraGuests': {
		            'fee': 0,
		            'after': 0
		        },
		        'bedrooms': 1,
		        'occupancy': 2,
		        'beds': 1,
		        'isCalAvailable': true,
		        'responseTime': '',
		        'fees': [],
		        'lastUpdatedAt': 0,
		        'heading': '',
		        'securityDeposit': 0,
		        'checkOut': '12:00am',
		        'checkIn': '12:00pm',
		        'size': -1
		    },
		    'price': {
		        'monthly': 0,
		        'nightly': 0,
		        'maxNight': 0,
		        'weekend': 0,
		        'minNight': 0,
		        'weekly': 0
		    },
		    'photos': [],
		    'location': {},
		    'provider': {
		        'domain': 'airbnb.com',
		        'full': 'Airbnb',
		        'cid': 'airbnb'
		    },
		    'amenities': [],
		    'reviews': {
		        'count': 0,
		        'rating': 0,
		        'entries': []
		    },
		    'priceRange': [
		        {
		            'nightly': 0,
		            'start': 0,
		            'end': 0,
		            'maxNight': 0,
		            'weekend': 0,
		            'monthly': 0,
		            'minNight': 0,
		            'weekly': 0
		        }
		    ],
		    'availability': [
		        {
		            'start': 0,
		            'end': 0
		        }
		    ]
		}
	},

	remove: function(stopId) {
		//collection deals with overhead
		this.trigger('removeStop', stopId);
	}
});

module.exports = stop_model;