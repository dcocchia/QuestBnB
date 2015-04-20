var lodging_model = require("../backbone_models/lodging_model");

var lodgings_collection = Backbone.Collection.extend({
	model: lodging_model,

	initialize: function(opts) {

	},
	
	fetchDebounced: _.debounce(function(data) { 
		this.fetch({
			data: data
		});
	}, 500)
});

module.exports = lodgings_collection;