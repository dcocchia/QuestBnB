;(function(window){
	var React = require('react');
	window.React = React;

	var moment = require("moment");
	require("moment-duration-format");
	window.moment = moment;

	var Promise = require("bluebird");
	
	//view/event orchestrator
	var view_orchestrator = require("./util/view_orchestrator");

	//map
	var map_api = require("./util/map_api");
	var map_view = require("./backbone_views/map_view");

	//backbone views
	var header_view = require("./backbone_views/header_view");
	var landing_view = require("./backbone_views/landing_view");
	var trip_view = require("./backbone_views/trip_view");
	var stop_page_view = require("./backbone_views/stop_page_view");

	//backbone collections
	var stops_collection = require("./backbone_collections/stops_collection");
	var travellers_collection = require("./backbone_collections/travellers_collection");
	var lodgings_collection = require("./backbone_collections/lodgings_collection");

	//backbone models
	var header_model = require("./backbone_models/header_model");
	var search_model = require("./backbone_models/search_model");
	var trip_model = require("./backbone_models/trip_model");


	var Router = Backbone.Router.extend({
		routes: {
			"": "landing",
			"trips/:id": "trip",
			"trips/:id/": "trip",
			"trips/:id/stops/:stopId": "stop",
			"trips/:id/stops/:stopId/": "stop"
		}
	});

	var App = view_orchestrator.extend({
		initialize: function(opts) {
			this.router = opts.router;
			this.models = {};
			this.views = {};
			this.collections = {};
			this.loadView(header_view, "header_view", {
				$parentEl: $(".header-nav-wrapper"),
				el: $(".header-nav"), 
				model: this.loadModel(header_model, "header_model")
			});
			this.loadView(map_view, "map_view", { el: $(".map")});
			this.map_api = new map_api(this.views["map_view"].map);
			this.setRouteListeners();
			this.startOrchestrator({
				Models: {
					search_model: search_model,
					trip_model: trip_model
				},
				Views: {
					landing_view: landing_view,
					trip_view: trip_view,
					stop_page_view: stop_page_view
				},
				Collections: {
					stops_collection: stops_collection,
					travellers_collection: travellers_collection,
					lodgings_collection: lodgings_collection
				}
			});
			Backbone.history.start({pushState: true});
		},

		setRouteListeners: function() {
			this.router.on("route:landing", _.bind( function() {
				this.loadModel(search_model, "search_model", {
					map_api: this.map_api
				});
				this.loadView(landing_view, "landing_view", { 
					$parentEl: this.$el,
					el: $(".landing-page"), 
					map_api: this.map_api, 
					model: this.models["search_model"] 
				});
			}, this));

			this.router.on("route:trip", _.bind( function(tripId) { 
				this.loadModel(trip_model, "trip_model");
				this.models["trip_model"].setUrl(tripId);
				
				this.loadView(trip_view, "trip_view", {
					$parentEl: this.$el, 
					el: $(".trip-page"), 
					map_api: this.map_api,
					map_view: this.views["map_view"],
					model: this.models["trip_model"],
					stops_collection: stops_collection,
					travellers_collection: travellers_collection
				});

				this.models["trip_model"].fetch({
					success: _.bind(function(resp) {
						this.models["trip_model"].trigger("ready");
					}, this)
				});

			}, this));

			this.router.on("route:stop", function() { console.log("stop view!") });
		},

		loadView: function(view, viewName, options) {
			return this._load(view, "views", viewName, options);
		},

		loadModel: function(model, modelName, options) {
			return this._load(model, "models", modelName, options);
		},

		loadCollection: function(collection, collectionName, options) {
			return this._load(collection, "collections", collectionName, options);
		},

		_load: function(obj, type, name, options) {
			if (this[type][name]) {
				this[type][name].initialize(options);
			} else {
				this[type][name] = new obj(options);
			}

			return this[type][name];
		}
	});

	$(function() { 
		var app = new App({
			router: new Router(),
			el: $(".page-view")
		});
	});
})(window);