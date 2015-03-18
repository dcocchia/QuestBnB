;(function(window){
	var React = require('react');
	window.React = React;

	var Promise = require("bluebird");

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
					$parentEl: this.$el,
					el: $(".landing-page"), 
					map_api: this.map_api, 
					model: this.models["search_model"] 
				});
			}, this));

			this.router.on("route:trip", _.bind( function(tripId) { 
				this.loadModel(trip_model, "trip_model");
				this.models["trip_model"].setUrl(tripId);
				this.models["trip_model"].fetch();

				this.loadView(trip_view, "trip_view", {
					$parentEl: this.$el, 
					el: $(".trip-page"), 
					map_api: this.map_api,
					map_view: this.views["map_view"],
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

		//TODO: this will get unruly. Pull into some kind of orechestrator
		setViewListeners: function() {
			Backbone.on("landing_view:submit", _.bind(function(data) {
				var timeOutPromise = new Promise(function(resolve, reject) {
					setTimeout(function() {
						resolve();
					}, 1000);
				});

				var dbQueryPromise = new Promise(_.bind(function(resolve, reject) {			

					this.loadModel(trip_model, "trip_model", {
						title: "Your Next Adventure",
						start: data.start,
						end: data.end,
						numStops: 2,
						travellers: [
							{
								name: "You",
								img: {
									src: "/app/img/default-icon.jpg"
								}
							}
						],
						stops: [
							{
								location: "Home",
								stopNum: 1,
								dayNum: 1,
								milesNum: 0
							},
							{
								location: data.location,
								stopNum: 2,
								dayNum: 1,
								milesNum: 0
							}
						]
					});

					this.loadView(trip_view, "trip_view", {
						$parentEl: this.$el, 
						el: $(".trip-page"), 
						map_api: this.map_api,
						map_view: this.views["map_view"],
						model: this.models["trip_model"]
					});

					//TODO: validation in the model
					this.models["trip_model"].save(null, {
						success: function(data) {
							resolve(data);
						},
						error: function() {
							reject();
						}
					});
				}, this));

				//1 second for animation, and unknown time for db query result
				Promise.all([timeOutPromise, dbQueryPromise]).then( _.bind(function(a, b){
					var trip_model = this.models["trip_model"];
					var tripId = this.models["trip_model"].get("_id");
					trip_model.setUrl(tripId);
					trip_model.fetch();
					this.router.navigate("/trips/" + tripId);
					Backbone.trigger("trip_view:render");
				}, this));
				
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
			el: $(".page-view")
		});
	});
})(window);