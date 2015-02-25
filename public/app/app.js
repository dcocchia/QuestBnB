;(function(window){
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
			this.setRouteListeners();
			Backbone.history.start({pushState: true});
		},

		setRouteListeners: function() {
			this.router.on("route:landing", function() { console.log("landing view!") });
			this.router.on("route:trip", function() { console.log("trip view!") });
			this.router.on("route:stops", function() { console.log("stops view!") });
			this.router.on("route:stop", function() { console.log("stop view!") });
			this.router.on("route:overview", function() { console.log("overview view!") });
		},

		render: function() {

		}
	});

	var app = new App({
		router: new Router(),
		el: $(".container")
	});
})(window);