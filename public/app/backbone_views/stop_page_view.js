//backbone views
var PageView 			= require('./page_view');
var SearchQueryView 	= require('./lodgings_search_query_view');
var SearchResultsView 	= require('./lodgings_search_results_view');

//backbone models
var searchQueryModel 	= require('../backbone_models/lodgings_search_query_model');
var lodgingsMetaModel	= require('../backbone_models/lodgings_meta_model');

//jsx template
var stop_template 		= require('../../views/StopView');

var stop_page_view = PageView.extend({
	_bootStrapView: function() {
		var $dataElm = this.$('.bootstrap-data');

		var $modelDataElm = $dataElm.find('.bootstrap-data-model');
		var modelData = 
			($modelDataElm.length > 0) 
			? $modelDataElm.data('modelData')
			: {};

		var $resultDataElm = $dataElm.find('.bootstrap-data-results');
		var resultData = 
			($resultDataElm.length > 0) 
			? $resultDataElm.data('resultData')
			: [];

		var $resultMetaDataElm = $dataElm.find('.bootstrap-data-results-meta');
		var resultMetaData =
			($resultMetaDataElm.length > 0) 
			? $resultMetaDataElm.data('resultMetaData')
			: {};

		modelData.isServer = false;
		this.model.set(modelData, {silent: true});
		this.lodgings_collection.add(resultData, {silent: true});
		this.lodgings_meta_model.set(resultMetaData, {silent: true});

		this.lodgings_collection.trigger('sync');

		$dataElm.remove();
	},

	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
	},

	elms: {},

	initialize: function(opts) {
		opts || (opts = {});
		this.map_api = opts.map_api;
		this.map_view = opts.map_view;
		this.trip_model = opts.trip_model;
		this.lodgings_collection = opts.lodgings_collection;
		this.lodgings_meta_model = opts.lodgings_collection.lodgings_meta_model;
		this.lodgings_collection.stop_model = this.model;
		this._findElms(opts.$parentEl);
		this.createSubViews();

		Backbone.on('stop_view:render', _.bind(function() {
			this.render(stop_template, {
				tripTitle: this.trip_model.get('title')
			});
			this.map_view.setMode('stop-view');
		}, this));

		Backbone.on('stop_view:search:render', _.bind(function(lodgingData) {
			this.render(stop_template, lodgingData);
		}, this));

		this.model.on('change', _.bind(function() {
			this.render(stop_template, {
				isServer: false,
				lodgingData: {
					result: this.lodgings_collection.toJSON(),
					count: this.lodgings_meta_model.get('count'),
					resultsPerPage: this.lodgings_meta_model.get('resultsPerPage'),
					page: this.lodgings_meta_model.get('page')
				}
			});
		}, this));
		
	},

	createSubViews: function() {
		if (!this.searchQueryView) { 
			this.searchQueryView = new SearchQueryView({
				el: $('.search-query-wrapper'),
				parentView: this,
				model: new searchQueryModel({
					start: this.trip_model.get('start'),
					end: this.trip_model.get('end'),
					location: this.model.get('location'),
					geo: this.model.get('geo')
				}),
				map_api: this.map_api,
				lodgings_collection: this.lodgings_collection
			}); 
		}

		if (!this.searchResultsView) { 
			this.searchResultsView = new SearchResultsView({
				el: $('.search-results-wrapper'),
				parentView: this,
				lodgings_collection: this.lodgings_collection,
				lodgings_meta_model: this.lodgings_meta_model,
				stop_model: this.model
			}); 
		}
	}
});

module.exports = stop_page_view;