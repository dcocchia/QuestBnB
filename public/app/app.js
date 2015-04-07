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
	var landing_view = require("./backbone_views/landing_view");
	var trip_view = require("./backbone_views/trip_view");

	//backbone collections
	var stops_collection = require("./backbone_collections/stops_collection");
	var travellers_collection = require("./backbone_collections/travellers_collection");

	//backbone models
	var search_model = require("./backbone_models/search_model");
	var trip_model = require("./backbone_models/trip_model");


	var Router = Backbone.Router.extend({
		routes: {
			"": "landing",
			"trips/:id": "trip",
			"trips/:id/": "trip",
			"trips/:id/stops": "stops",
			"trips/:id/stops/": "stops",
			"trips/:id/stops/:stopId": "stop",
			"trips/:id/stops/:stopId/": "stop",
			"trips/:id/overview": "overview",
			"trips/:id/overview/": "overview"
		}
	});

	var App = view_orchestrator.extend({
		initialize: function(opts) {
			this.router = opts.router;
			this.views = {};
			this.models = {};
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
					trip_view: trip_view
				},
				Collections: {
					stops_collection: stops_collection,
					travellers_collection: travellers_collection
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

				this.models["trip_model"].fetch();

			}, this));

			this.router.on("route:stops", function() { console.log("stops view!") });
			this.router.on("route:stop", function() { console.log("stop view!") });
			this.router.on("route:overview", function() { console.log("overview view!") });
		},

		loadView: function(view, viewName, options) {
			if (this.views[viewName]) {
				this.views[viewName].initialize(options);
			} else {
				this.views[viewName] = new view(options);
			}

			return this.views[viewName];
		},

		loadModel: function(model, modelName, options) {
			if (this.models[modelName]) {
				this.models[modelName].initialize(options);
			} else {
				this.models[modelName] = new model(options);
			}

			return this.models[modelName];
		}
	});

	$(function() { 
		var app = new App({
			router: new Router(),
			el: $(".page-view")
		});
	});
})(window);