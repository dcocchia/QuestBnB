var lodging_model = require('../backbone_models/lodging_model');

var lodgings_collection = Backbone.Collection.extend({
	model: lodging_model,
	url: '/lodgings',

	initialize: function(models, opts) {
		if (!opts) { opts = {}; }
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
	
	fetchDebounced: _.debounce(function() { 
		this.fetch({
			data: {
				page: this.lodgings_meta_model.get("page"),
				latitude: this.stop_model.get("geo").lat,
				longitude: this.stop_model.get("geo").lng
			}
		});
	}, 500),

	getLodging: function(resultId) {
		return _.find(this.models, _.bind(function(model) {
			return ( model.get('id') === resultId );
		}, this));
	}
});

module.exports = lodgings_collection;