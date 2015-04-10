var Promise = require("bluebird");

var ViewOrchestrator = Backbone.View.extend({

	startOrchestrator: function(opts) {
		this.Views = opts.Views;
		this.Collections = opts.Collections;
		this.Models = opts.Models;

		this.setMapListeners();
		this.setViewListeners();
	},

	setMapListeners: function() {
		var mapView = this.views["map_view"];

		Backbone.on("map:setCenter", _.bind(mapView.setCenter, mapView));
		Backbone.on("map:setMarker", _.bind(mapView.setMarker, mapView));
		Backbone.on("map:clearMarkers", _.bind(mapView.clearMarkers, mapView));
		Backbone.on("map:setZoom", _.bind(mapView.setZoom, mapView));
	},

	setViewListeners: function() {
		Backbone.on("landing_view:submit", _.bind(function(data) {
			var timeOutPromise = new Promise(function(resolve, reject) {
				setTimeout(function() {
					resolve();
				}, 1000);
			});

			var dbQueryPromise = new Promise(_.bind(function(resolve, reject) {			

				this.loadModel(this.Models.trip_model, "trip_model", {
					title: "Your Next Adventure",
					start: data.start,
					end: data.end,
					numStops: 2,
					travellers: [
						{
							name: "You",
							img: {
								src: "/app/img/default-icon.png"
							}
						}
					],
					stops: [
						{	//TODO: find a better default first stop. This won't work very well
							//if geo loc'ed use that, otherwise only use one stop
							location: "Home",
							stopNum: 1,
							dayNum: 1,
							lodging: {
								id: "quest_home"
							}
						},
						{
							location: data.location,
							stopNum: 2,
							dayNum: 1
						}
					]
				});

				this.loadModel(this.Models.search_model, "search_model", {
					map_api: this.map_api
				});

				this.loadView(this.Views.trip_view, "trip_view", {
					$parentEl: this.$el, 
					el: $(".trip-page"), 
					map_api: this.map_api,
					map_view: this.views["map_view"],
					model: this.models["trip_model"],
					search_model: this.models["search_model"],
					stops_collection: this.Collections.stops_collection,
					travellers_collection: this.Collections.travellers_collection
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
				this.models["trip_model"].trigger("change");
				Backbone.trigger("trip_view:render", true);
			}, this));
			
		}, this));
	}
});

module.exports = ViewOrchestrator;