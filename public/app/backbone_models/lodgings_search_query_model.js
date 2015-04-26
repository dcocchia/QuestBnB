var lodgings_search_query_model = Backbone.Model.extend({
	defaults: {
		start: "",
		end: "",
		location: "No location chosen",
		guests: 1,
		pricemin: 0,
		pricemax: 1000,
		page: 1,
		geo: {
			lat: 0,
			lng: 0
		}
	},

	initialize: function() {
	}

});

module.exports = lodgings_search_query_model;