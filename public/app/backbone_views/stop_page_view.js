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
			? $modelDataElm.attr('data-model-data')
			: {};

		var $resultDataElm = $dataElm.find('.bootstrap-data-results');
		var resultData = 
			($resultDataElm.length > 0) 
			? $resultDataElm.attr('data-result-data')
			: [];

		var $resultMetaDataElm = $dataElm.find('.bootstrap-data-results-meta');
		var resultMetaData =
			($resultMetaDataElm.length > 0) 
			? $resultMetaDataElm.attr('data-result-meta-data')
			: {};

		modelData 		= JSON.parse(modelData);
		resultData 		= JSON.parse(resultData);
		resultMetaData 	= JSON.parse(resultMetaData);
		
		modelData.isServer = false;
		this.model.set(modelData, {silent: true});
		this.lodgings_collection.add(resultData, {silent: true});
		this.lodgings_meta_model.set(resultMetaData, {silent: true});

		this.lodgings_collection.trigger('sync');

		$dataElm.remove();

		this.trigger('ready');
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

		this.on('ready', _.bind(function() {
			Backbone.trigger('map:setCenter', {
				lat: this.model.get('geo').lat, 
				long: this.model.get('geo').lng
			});

			Backbone.trigger('map:setZoom', 16);
		}, this));

		Backbone.on('stop_view:render', _.bind(function() {
			this.render(stop_template, {
				tripTitle: this.trip_model.get('title'),
				tripId: this.trip_model.get('_id')
			});
			this.map_view.setMode('stop-view');
		}, this));

		Backbone.on('stop_view:search:render', _.bind(function(lodgingData) {
			this.render(stop_template, lodgingData);
		}, this));

		Backbone.on('stop_view:query_view:render', _.bind(function(data) {
			this.render(stop_template, {
				isServer: false,
				isLoading: this.lodgings_meta_model.get("isLoading"),
				lodgingData: {
					result: this.lodgings_collection.toJSON(),
					count: this.lodgings_meta_model.get('count'),
					resultsPerPage: this.lodgings_meta_model.get('resultsPerPage'),
					page: this.lodgings_meta_model.get('page')
				},
				locationProps: data.location_props
			});
		}, this));

		this.model.on('change', _.bind(function() {
			this.render(stop_template, {
				isServer: false,
				isLoading: this.lodgings_meta_model.get("isLoading"),
				lodgingData: {
					result: this.lodgings_collection.toJSON(),
					count: this.lodgings_meta_model.get('count'),
					resultsPerPage: this.lodgings_meta_model.get('resultsPerPage'),
					page: this.lodgings_meta_model.get('page')
				},
				tripTitle: this.trip_model.get('title')
			});
			this.synModelDebounced();
		}, this));
		
	},

	synModelDebounced: _.debounce(function() { 
		this.model.sync('update', this.model, {url: this.model.url});
	}, 500),

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
				stop_model: this.model,
				map_api: this.map_api,
				lodgings_collection: this.lodgings_collection,
				lodgings_meta_model: this.lodgings_meta_model,
				trip_model: this.trip_model
			}); 
		}

		if (!this.searchResultsView) { 
			this.searchResultsView = new SearchResultsView({
				el: $('.search-results-wrapper'),
				parentView: this,
				lodgings_collection: this.lodgings_collection,
				lodgings_meta_model: this.lodgings_meta_model,
				stop_model: this.model,
				map_api: this.map_api,
				trip_model: this.trip_model
			}); 
		}
	}
});

module.exports = stop_page_view;