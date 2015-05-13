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
		this.trip_model				= opts.trip_model;
		this.parentView				= opts.parentView;
		this.map_api				= opts.map_api;
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
			this.scrollToTop();
			this.hideSpinner();
		}, this));

		this.lodgings_collection.on('change', _.bind(function() {
			this.render();
		}, this));

		this.stop_model.on("change", _.bind(function(){
			this.createChosenLodgingView();
		},this))

		Backbone.on('StopView:render', _.bind(function() {
			this.setElement(this.parentView.$el.find(this.$el.selector));
			Backbone.trigger('lodgings_search_results_view:render');
		}, this));

		Backbone.on('StopView:removeChosenLodging', _.bind(
			this.destroyChosenLodgingView, 
			this
		));

		Backbone.on('StopView:scrollTop', _.bind(this.scrollToTop, this));
		Backbone.on('StopView:scrollToElm', _.bind(this.scrollToElm, this));

		Backbone.on('StopView:showSpinner', _.bind(this.showSpinner, this));
		Backbone.on('StopView:hideSpinner', _.bind(this.hideSpinner, this));
	},

	createResultsViews: function() {
		this.clearResultsViews();
		_.each(this.lodgings_collection.models, _.bind(function(model, index) {
			this.createResultView(model);
		}, this));

		this.createChosenLodgingView();

		this.map_api.placeLodgingsMapMarkers(this.lodgings_collection);
	},

	createResultView: function(model, opts) {
		var defaults = {
			model: model,
			stop_model: this.stop_model,
			map_api: this.map_api,
			lodgings_collection: this.lodgings_collection,
			parentView: this,
			el: this.$('.search-results-wrapper-inner')
					.find('[data-id=' + model.get('id') + ']')
		}

		if (!opts) { opts = {}; }
		_.defaults(opts, defaults);

		var newView = new lodging_view(opts);

		this.lodgingViews.push(newView);

		return newView;
	},

	createChosenLodgingView: function() {
		var newView;
		var newModelData;
		var lodgingData = this.stop_model.get('lodging');

		if (!lodgingData) { return; }

		if (this.chosenLodgingView) {
			this.chosenLodgingView.model.set(lodgingData);
			this.chosenLodgingView.setElement(this.$('.search-page-lodging-wrapper')
					.find('[data-id=' + lodgingData.id + ']'));
			return;
		}

		this.clearChosenLodgingView();

		newView = this.createResultView( 
			new lodging_model( 
				lodgingData 
			), {
				el: this.$('.search-page-lodging-wrapper')
					.find('[data-id=' + lodgingData.id + ']')
			});

		this.chosenLodgingView = newView;

		newView.listenTo(newView.model, 'change', _.bind(function(model) {
			this.stop_model.set('lodging', model.toJSON(), {silent: true});
			this.render();
		}, this));
	},

	clearResultsViews: function() {
		_.each(this.lodgingViews, _.bind(function(view, index) {
			view.destroy();
		}, this));

		this.lodgingViews.length = 0;
	},

	clearChosenLodgingView: function() {
		if (this.chosenLodgingView) {
			this.chosenLodgingView.destroy();
		}

		delete this.chosenLodgingView;
	},

	destroyChosenLodgingView: function() {
		this.clearChosenLodgingView();
		this.stop_model.set('lodging', {});
	},

	render: function() {
		var collectionData = this.lodgings_collection.toJSON();
		var lodgingsMetaData = this.lodgings_meta_model.toJSON();
		var tripTitle = this.trip_model.get('title');
		var tripId = this.trip_model.get('_id');

		var renderModel = {
			isServer: false,
			isLoading: !!lodgingsMetaData.isLoading,
			lodgingData: {
				result: collectionData,
				count: lodgingsMetaData.count,
				resultsPerPage: lodgingsMetaData.resultsPerPage,
				page: lodgingsMetaData.page
			}
		}

		if (tripTitle) { renderModel.tripTitle = tripTitle; }
		if (tripId) { renderModel.tripId = tripId; }

		Backbone.trigger('stop_view:search:render', renderModel);
	},

	onPaginate: function(e) {
		var $target = $(e.currentTarget);
		var page = $target.parent().attr('data-page');
		
		e.preventDefault();

		this.showSpinner();
		this.lodgings_meta_model.set('page', page);
		this.lodgings_collection.fetchDebounced();

	},

	showSpinner: function() {
		this.spinner.spin();
		this.lodgings_meta_model.set('isLoading', true);
		this.render();
		this.$el.append(this.spinner.el);
	},

	hideSpinner: function() {
		this.spinner.stop();
		this.lodgings_meta_model.set('isLoading', false);
		this.render();
	},

	scrollToTop: function() {
		this.scrollToElm();
	},

	scrollToElm: function($elm) {
		var $panel = this.parentView.$el.find('.side-bar');

		if (!$elm) { $elm = $panel; }
		
		$panel.animate({
			scrollTop: $elm.offset().top
		}, '1500', 'linear');
	}
});

module.exports = lodgings_search_results_view;