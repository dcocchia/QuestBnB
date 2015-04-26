var lodging_model = require("../backbone_models/lodging_model");

var lodgings_collection = Backbone.Collection.extend({
	model: lodging_model,

	initialize: function(models, opts) {
		opts || (opts = {});
		this.url 					= opts.url;
		this.lodgings_meta_model 	= opts.lodgings_meta_model;
	},

	parse: function(response) {
		this.lodgings_meta_model.set({
			count: response.count,
			resultsPerPage: response.resultsPerPage,
			page: response.page
		});
		
		return response.result;
	},
	
	fetchDebounced: _.debounce(function(data) { 
		this.fetch({
			data: data
		});
	}, 500),

	getLodging: function(resultId) {
		return _.find(this.models, _.bind(function(model, index) {
			return ( model.get("id") === resultId );
		}, this));
	}
});

module.exports = lodgings_collection;