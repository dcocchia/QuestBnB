;(function(window){
	var React = require('react');
	window.React = React;

	var map_api = require("./util/map_api");
	var Landing_View = require("./backbone_views/landing_view");
	var searchModel = require("./backbone_models/searchModel");

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
			this.setRouteListeners();
			Backbone.history.start({pushState: true});
		},

		setRouteListeners: function() {
			this.router.on("route:landing", _.bind( function() { 
				this.loadView(Landing_View, "landing_view", { el: $(".landing-page"), map_api: map_api, model: new searchModel() }); 
			}, this));
			this.router.on("route:trip", function() { console.log("trip view!") });
			this.router.on("route:stops", function() { console.log("stops view!") });
			this.router.on("route:stop", function() { console.log("stop view!") });
			this.router.on("route:overview", function() { console.log("overview view!") });
		},

		loadView: function(view, viewName, options) {
			if (this.views[viewName]) {
				this.views[viewName].initialize();
			} else {
				this.views[viewName] = new view(options);
			}
		}
	});

	$(function() { 
		var app = new App({
			router: new Router(),
			el: $(".container")
		});
	});
})(window);