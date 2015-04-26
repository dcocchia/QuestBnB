var lodgings_meta_model = Backbone.Model.extend({
	defaults: {
		"count": {
			"totalResults": 20,
			"totalPages": 1
		},
		"resultsPerPage": 20
	}
});

module.exports = lodgings_meta_model;