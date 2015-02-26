;(function(window){
	require(["app/util/map_api"], function(Map_Api) {

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
				this.map_api = new Map_Api();
				this.setRouteListeners();
				Backbone.history.start({pushState: true});
			},

			setRouteListeners: function() {
				this.router.on("route:landing", _.bind( function() { 
					this.loadView( "landing_view", { el: $(".landing-page"), map_api: this.map_api }); 
				}, this));
				this.router.on("route:trip", function() { console.log("trip view!") });
				this.router.on("route:stops", function() { console.log("stops view!") });
				this.router.on("route:stop", function() { console.log("stop view!") });
				this.router.on("route:overview", function() { console.log("overview view!") });
			},

			loadView: function(viewName, options) {
				require(["app/views/" + viewName + ".js"], _.bind(function(view) {
					if (this.views[viewName]) {
						this.views[viewName].initialize();
					} else {
						this.views[viewName] = new view(options);
					}
				}, this));
			}
		});

		var app = new App({
			router: new Router(),
			el: $(".container")
		});
	});
})(window);