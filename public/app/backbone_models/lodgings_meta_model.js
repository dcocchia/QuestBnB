var moment = require('moment');
var lodgings_meta_model = Backbone.Model.extend({
	defaults: {
		'count': {
			'totalResults': 20,
			'totalPages': 1
		},
		'resultsPerPage': 20,
		'pricemax': 1000,
		'pricemin': 1,
		'stimestamp': moment().add(1, 'week').valueOf(), //checkin time,
		'etimestamp': moment().add(2, 'week').valueOf() //checkout time

	},

	parse: function(resp) {
		resp.checkin = moment(resp.stimestamp).format('MM/DD/YYYY');
		resp.checkout = moment(resp.etimestamp).format('MM/DD/YYYY');

		return resp;
	}


});

module.exports = lodgings_meta_model;