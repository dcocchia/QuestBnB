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

		Backbone.on(
			"map:setCenter", 
			_.bind(mapView.setCenter, mapView)
		);

		Backbone.on(
			"map:setMarker", 
			_.bind(this.map_api.makeMarker, mapView)
		);

		Backbone.on(
			"map:clearMarkers", 
			_.bind(this.map_api.clearMarkers, mapView)
		);

		Backbone.on(
			"map:setZoom", 
			_.bind(mapView.setZoom, mapView)
		);
	},

	setViewListeners: function() {
		Backbone.on("landing_view:submit", _.bind(function(data) {
			this.goToTripView(data);
		}, this));

		Backbone.on("TripView:go_to_stop", _.bind(function(stopId) {
			this.goToStopView(stopId);
		}, this));
	},

	goToTripView: function(data) {
		var timeOutPromise = new Promise(_.bind(function(resolve, reject) {
			setTimeout(_.bind(function() {
				this.map_api.triggerMapResize();
				resolve();
			}, this), 1000);
		}, this));

		var dbQueryPromise = new Promise(_.bind(function(resolve, reject) {
			var homeStop = function() {
				if (data.home) {
					return {
						location: data.home.formatted_address,
						stopNum: 1,
						dayNum: 1,
						lodging: {
							id: "quest_home"
						}
					}
				} else {
					return false;
				}
			}();

			var stops = [];
			if (homeStop) { stops.push(homeStop); }
			stops.push({
				location: data.location,
				stopNum: stops.length + 1,
				dayNum: 1
			});

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
				stops: stops
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
		Promise.all([timeOutPromise, dbQueryPromise])
			.then( _.bind(function(a, b){
				var trip_model = this.models["trip_model"];
				var tripId = this.models["trip_model"].get("_id");
				trip_model.setUrl(tripId);
				trip_model.trigger("ready");
				this.router.navigate("/trips/" + tripId);
				trip_model.saveLocalStorageReference();
				Backbone.trigger("trip_view:render", true);
			}, this));
	},

	goToStopView: function(stopId) {
		var tripModel = this.models["trip_model"];
		var tripId = tripModel.get("_id");
		var tripView = this.views["trip_view"];
		var stopModel = tripView.stops_collection.getStop(stopId);
		var url = '/trips/' + tripId + '/stops/' + stopId;

		this.loadModel(this.Models.lodgings_meta_model, 'lodgings_meta_model');

		this.loadCollection(
			this.Collections.lodgings_collection, 
			'lodgings_collection',
			[
				[],
				{
					url: '/lodgings',
					lodgings_meta_model: this.models.lodgings_meta_model
				}
			]
		);

		this.loadView(this.Views.stop_page_view, "stop_page_view", {
			$parentEl: this.$el,
			el: $(".stop-page"),
			map_api: this.map_api,
			map_view: this.views["map_view"],
			model: stopModel,
			trip_model: tripModel,
			lodgings_collection: this.collections.lodgings_collection
		});

		this.views.stop_page_view.model.url = url;

		this.views["stop_page_view"].trigger("ready");

		this.collections.lodgings_collection.fetchDebounced();

		this.router.navigate(url);
		Backbone.trigger("stop_view:render");
	}

});

module.exports = ViewOrchestrator;