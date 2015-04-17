var SearchModel = Backbone.Model.extend({
	defaults: {
		queryPredictions: [],
		queryStatus: "noResults"
	},

	initialize: function(opts) {
		this.map_api = opts.map_api;
	},

	getQueryPredictions: function(options) {
		this.map_api.getQueryPredictions(options, _.bind( this.setModelQuery, this));
	},

	setModelQuery: function(predictions, status) {
		switch(status) {
			case google.maps.places.PlacesServiceStatus.OK:
				this.set({
					"queryPredictions": predictions,
					"queryStatus": "OK"
				});
				break;
			case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
				this.set({
					"queryPredictions": [],
					"queryStatus": "noResults"
				});
				break;
			default:
				this.set({
					"queryPredictions": [],
					"queryStatus": "error"
				});
				console.warning("Google Query Failure: ", status);
				break;
		}
	},

	clear: function() {
		this.set(this.defaults);
	}
});

module.exports = SearchModel;