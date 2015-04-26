var renderer = require("../../../renderer/client_renderer");
var lodging_view = require("../backbone_views/lodging_result_view");
var lodging_model = require("../backbone_models/lodging_model");

var lodgings_search_results_view = Backbone.View.extend({

	initialize: function(opts) {
		opts || (opts = {});
		this.template 				= opts.template;
		this.lodgings_collection	= opts.lodgings_collection;
		this.lodgings_meta_model	= opts.lodgings_meta_model;
		this.stop_model				= opts.stop_model;
		this.parentView				= opts.parentView;
		this.lodgingViews 			= [];

		this.lodgings_collection.on("sync", _.bind(function() {
			this.render();
			this.createResultsViews();
		}, this));

		this.lodgings_collection.on("add", _.bind(function(model) {
			this.render();
			this.createResultView(model);
		}, this));

		Backbone.on("StopView:render", _.bind(function() {
			this.setElement(this.parentView.$el.find(this.$el.selector));
			Backbone.trigger("lodgings_search_results_view:render");
		}, this));
	},

	createResultsViews: function() {
		this.clearResultsViews();
		_.each(this.lodgings_collection.models, _.bind(function(model, index) {
			this.createResultView(model);
		}, this));
	},

	createResultView: function(model) {
		//TODO: lodging views need unique ids for el
		//TODO: lodging models need their own result data
		this.lodgingViews.push(
			new lodging_view({
				model: model,
				parentView: this,
				el: this.$("[data-id='" + model.get("id") + "']")
			})
		);
	},

	clearResultsViews: function() {
		_.each(this.lodgingViews, _.bind(function(view, index) {
			view.destroy();
		}, this));

		this.lodgingViews.length = 0;
	},

	render: function(data) {
		var collectionData = this.lodgings_collection.toJSON();
		var lodgingsMetaData = this.lodgings_meta_model.toJSON();

		var renderModel = {
			isServer: false,
			lodgingData: {
				result: collectionData,
				count: lodgingsMetaData.count,
				resultsPerPage: lodgingsMetaData.resultsPerPage,
				page: lodgingsMetaData.page
			}
		}

		Backbone.trigger("stop_view:search:render", renderModel);
	}
});

module.exports = lodgings_search_results_view;