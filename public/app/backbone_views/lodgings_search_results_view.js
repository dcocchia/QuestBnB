var lodging_view = require("../backbone_views/lodging_result_view");
var lodging_model = require("../backbone_models/lodging_model");

var lodgings_search_results_view = Backbone.View.extend({

	initialize: function(opts) {
		opts || (opts = {});
		this.template = opts.template;
		this.lodgings_collection = opts.lodgings_collection;
		this.lodgingViews = [];

		this.lodgings_collection.on("sync", _.bind(function() {
			this.render();
			this.createResultsViews();
		}, this));
	},

	createResultsViews: function() {
		//TODO: lodging views need unique ids for el
		//TODO: lodging models need their own result data
		_.each(this.lodgings_collection.models, _.bind(function(model, index) {
			this.lodgingViews.push(
				new lodging_view({
					model: new lodging_model({

					})
				})
			);
		}, this));
	},

	render: function(data) {
		var collectionData = this.toJSON();

		data || (data = {});

		_.extend(data, collectionData);

		renderer.render(this.template, data, this.$el[0]);

		this.setElement(this.$el.selector);
	}
});

module.exports = lodgings_search_results_view;