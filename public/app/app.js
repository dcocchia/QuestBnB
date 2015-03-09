;(function(window){
	var React = require('react');
	window.React = React;

	//map
	var map_api = require("./util/map_api");
	var map_view = require("./backbone_views/map_view");

	//backbone views
	var landing_view = require("./backbone_views/landing_view");
	var trip_view = require("./backbone_views/trip_view");

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

	var App = Backbone.View.extend({
		initialize: function(opts) {
			this.router = opts.router;
			this.views = {};
			this.models = {};
			this.loadView(map_view, "map_view", { el: $(".map")});
			this.map_api = new map_api(this.views["map_view"].map);
			this.setRouteListeners();
			this.setMapListeners();
			this.setViewListeners();
			Backbone.history.start({pushState: true});
		},

		setRouteListeners: function() {
			this.router.on("route:landing", _.bind( function() {
				this.loadModel(search_model, "search_model", {
					map_api: this.map_api
				});
				this.loadView(landing_view, "landing_view", { 
					el: $(".landing-page"), 
					map_api: this.map_api, 
					model: this.models["search_model"] 
				});
			}, this));

			this.router.on("route:trip", _.bind( function() { 
				this.loadModel(trip_model, "trip_model");

				this.loadView(trip_view, "trip_view", { 
					el: $(".trip-page"), 
					map_api: this.map_api,
					model: this.models["trip_model"]
				});

			}, this));

			this.router.on("route:stops", function() { console.log("stops view!") });
			this.router.on("route:stop", function() { console.log("stop view!") });
			this.router.on("route:overview", function() { console.log("overview view!") });
		},

		setMapListeners: function() {
			var mapView = this.views["map_view"];

			Backbone.on("map:setCenter", _.bind(mapView.setCenter, mapView));
			Backbone.on("map:setMarker", _.bind(mapView.setMarker, mapView));
			Backbone.on("map:clearMarkers", _.bind(mapView.clearMarkers, mapView));
			Backbone.on("map:setZoom", _.bind(mapView.setZoom, mapView));
		},

		setViewListeners: function() {
			//TODO: create trip model from data sent to backbone listener, sync to database?
			//render trip view using trip model on init
			Backbone.on("landing_view:submit", _.bind(function(data) {

				this.loadModel(trip_model, "trip_model", {
					start: data.start,
					end: data.end,
					travellerCount: data.travellers,
					stops: [
						{
							location: data.location
						}
					]
				});

				this.loadView(trip_view, "trip_view", { 
					el: $(".trip-page"), 
					map_api: this.map_api,
					model: this.models["trip_model"]
				}).render();

				
			}, this));
		},

		loadView: function(view, viewName, options) {
			if (this.views[viewName]) {
				this.views[viewName].initialize();
			} else {
				this.views[viewName] = new view(options);
			}

			return this.views[viewName];
		},

		loadModel: function(model, modelName, options) {
			if (this.models[modelName]) {
				this.models[modelName].initialize();
			} else {
				this.models[modelName] = new model(options);
			}

			return this.models[modelName];
		}
	});

	$(function() { 
		var app = new App({
			router: new Router(),
			el: $(".container")
		});
	});
})(window);