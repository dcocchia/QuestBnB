//backbone views
var PageView = require("./page_view");
var SearchQueryView = require("./lodgings_search_query_view");
var SearchResultsView = require("./lodgings_search_results_view");

//backbone models
var searchQueryModel = require("../backbone_models/lodgings_search_query_model");

//jsx templates
var stop_template = require("../../views/StopView");
var query_template = require("../../views/LodgingsSearchQueryView");
var results_template = require("../../views/LodgingsSearchResultsView");

var stop_page_view = PageView.extend({

	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
		this.elms.$queryEl = this.$(".search-query-wrapper");
		this.elms.$searchResults = this.$(".search-results-wrapper");
	},

	elms: {},

	initialize: function(opts) {
		opts || (opts = {});
		this.map_api = opts.map_api;
		this.map_view = opts.map_view;
		this.trip_model = opts.trip_model;
		this.lodgings_collection = opts.lodgings_collection;
		this.createSubViews();

		Backbone.on("stop_view:render", _.bind(function() {
			this.render(stop_template);
			this.map_view.setMode("stop-view");
		}, this));

		this._findElms(opts.$parentEl);
	},

	createSubViews: function() {
		if (!this.searchQueryView) { 
			this.searchQueryView = new SearchQueryView({
				el: this.elms.$queryEl,
				model: new searchQueryModel({
					start: this.trip_model.get("start"),
					end: this.trip_model.get("end"),
					location: this.model.get("location"),
					geo: this.model.get("geo")
				}),
				template: query_template,
				lodgings_collection: this.lodgings_collection
			}); 
		}

		if (!this.searchResultsView) { 
			this.searchResultsView = new SearchResultsView({
				el: this.elms.$searchResults,
				template: results_template,
				lodgings_collection: this.lodgings_collection
			}); 
		}
	}
});

module.exports = stop_page_view;