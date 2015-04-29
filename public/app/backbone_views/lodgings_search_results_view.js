var renderer = require('../../../renderer/client_renderer');
var lodging_view = require('../backbone_views/lodging_result_view');
var lodging_model = require('../backbone_models/lodging_model');

var lodgings_search_results_view = Backbone.View.extend({

	events: {
		"click .pagination-btn" : "onPaginate"
	},

	initialize: function(opts) {
		opts || (opts = {});
		this.template 				= opts.template;
		this.lodgings_collection	= opts.lodgings_collection;
		this.lodgings_meta_model	= opts.lodgings_meta_model;
		this.stop_model				= opts.stop_model;
		this.parentView				= opts.parentView;
		this.lodgingViews 			= [];

		this.spinner = new Spinner({
			lines: 11, // The number of lines to draw
			length: 40, // The length of each line
			width: 3, // The line thickness
			radius: 18, // The radius of the inner circle
			corners: 1, // Corner roundness (0..1)
			rotate: 0, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			color: '#ff5a5f', // #rgb or #rrggbb or array of colors
			speed: 1.4, // Rounds per second
			trail: 46, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: true, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: '50%', // Top position relative to parent
			left: '50%' // Left position relative to parent
		});

		this.lodgings_collection.on('sync', _.bind(function() {
			this.render();
			this.createResultsViews();
			this.hideSpinner();
		}, this));

		this.lodgings_collection.on('add', _.bind(function(model) {
			this.render();
			this.createResultView(model);
		}, this));

		this.lodgings_collection.on('change', _.bind(function() {
			this.render();
		}, this));

		Backbone.on('StopView:render', _.bind(function() {
			this.setElement(this.parentView.$el.find(this.$el.selector));
			Backbone.trigger('lodgings_search_results_view:render');
		}, this));
	},

	createResultsViews: function() {
		this.clearResultsViews();
		_.each(this.lodgings_collection.models, _.bind(function(model, index) {
			this.createResultView(model);
		}, this));
	},

	createResultView: function(model) {
		this.lodgingViews.push(
			new lodging_view({
				model: model,
				stop_model: this.stop_model,
				lodgings_collection: this.lodgings_collection,
				parentView: this,
				el: this.$('[data-id=' + model.get('id') + ']')
			})
		);
	},

	clearResultsViews: function() {
		_.each(this.lodgingViews, _.bind(function(view, index) {
			view.destroy();
		}, this));

		this.lodgingViews.length = 0;
	},

	render: function() {
		var collectionData = this.lodgings_collection.toJSON();
		var lodgingsMetaData = this.lodgings_meta_model.toJSON();

		var renderModel = {
			isServer: false,
			isLoading: lodgingsMetaData.isLoading,
			lodgingData: {
				result: collectionData,
				count: lodgingsMetaData.count,
				resultsPerPage: lodgingsMetaData.resultsPerPage,
				page: lodgingsMetaData.page
			}
		}

		Backbone.trigger('stop_view:search:render', renderModel);
	},

	onPaginate: function(e) {
		var $target = $(e.currentTarget);
		var page = $target.parent().attr("data-page");
		
		e.preventDefault();

		this.showSpinner();
		this.lodgings_meta_model.set("page", page);
		this.lodgings_collection.fetchDebounced();

	},

	showSpinner: function() {
		this.spinner.spin();
		this.lodgings_meta_model.set("isLoading", true);
		this.render();
		this.$el.append(this.spinner.el);
	},

	hideSpinner: function() {
		this.spinner.stop();
		this.lodgings_meta_model.set("isLoading", false);
		this.render();
	}
});

module.exports = lodgings_search_results_view;