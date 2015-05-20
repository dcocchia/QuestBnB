var Promise = require('bluebird');

var ViewOrchestrator = Backbone.View.extend({

	startOrchestrator: function(opts) {
		this.Views = opts.Views;
		this.Collections = opts.Collections;
		this.Models = opts.Models;

		this.setMapListeners();
		this.setViewListeners();
	},

	setMapListeners: function() {
		var mapView = this.views['map_view'];
		var map_api = this.map_api;

		Backbone.on(
			'map:setCenter', 
			_.bind(mapView.setCenter, mapView)
		);

		Backbone.on(
			'map:setMarker', 
			_.bind(map_api.makeMarker, map_api)
		);

		Backbone.on(
			'map:clearMarkers', 
			_.bind(map_api.clearMarkers, map_api)
		);

		Backbone.on(
			'map:setZoom', 
			_.bind(mapView.setZoom, mapView)
		);
	},

	setViewListeners: function() {
		Backbone.on('landing_view:submit', _.bind(function(data) {
			this.goToTripView(data);
		}, this));

		Backbone.on('TripView:go_to_stop', _.bind(function(stopId) {
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
							id: 'quest_home'
						}
					}
				} else {
					return false;
				}
			}();

			var thisUrl;
			var stops = [];
			var travellers = parseInt(data.travellers) - 1;
			//-1 because user is always added to the model

			if (homeStop) { stops.push(homeStop); }

			//add start/home location as first stop
			stops.push({
				location: data.location,
				stopNum: stops.length + 1,
				dayNum: 1
			});

			//load default trip model with start/end dates and first stop
			this.loadModel(this.Models.trip_model, 'trip_model', {
				title: 'Your Next Adventure',
				start: data.start,
				end: data.end,
				numStops: 2,
				travellers: [
					{
						name: 'You',
						img: {
							src: '/app/img/default-icon.png'
						}
					}
				],
				stops: stops
			});

			//add blank/default travellers based on number set on landing page
			for (var i = 0; i < travellers; i++) {
				this.models.trip_model.attributes.travellers.push({
					img: {
						src: '/app/img/default-icon.png'
					}
				});
			}

			this.loadModel(this.Models.search_model, 'search_model', {
				map_api: this.map_api
			});

			this.loadView(this.Views.trip_view, 'trip_view', {
				$parentEl: this.$el, 
				el: $('.trip-page'), 
				map_api: this.map_api,
				map_view: this.views.map_view,
				model: this.models.trip_model,
				search_model: this.models.search_model,
				stops_collection: this.Collections.stops_collection,
				travellers_collection: this.Collections.travellers_collection
			});

			//set url before calling save
			thisUrl = this.models.trip_model.get('_id');
			if (thisUrl) { this.models.trip_model.setUrl(thisUrl); }
			
			this.models.trip_model.save(null, {
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
				var trip_model = this.models.trip_model;
				var tripId = this.models.trip_model.get('_id');
				trip_model.setUrl(tripId);
				trip_model.trigger('ready');
				this.router.navigate('/trips/' + tripId);
				trip_model.saveLocalStorageReference();
				Backbone.trigger('trip_view:render', true);
				ga('send', 'pageview', '/trips');
			}, this));
	},

	goToStopView: function(stopId) {
		var tripModel = this.models.trip_model;
		var tripId = tripModel.get('_id');
		var tripView = this.views.trip_view;
		var stopModelData = tripView.stops_collection.getStop(stopId).toJSON();
		var stopModel = this.loadModel(
			this.Models.stop_model, 
			'lodgings_meta_model',
			stopModelData
		);
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

		this.loadView(this.Views.stop_page_view, 'stop_page_view', {
			$parentEl: this.$el,
			el: $('.stop-page'),
			map_api: this.map_api,
			map_view: this.views.map_view,
			model: stopModel,
			trip_model: tripModel,
			lodgings_collection: this.collections.lodgings_collection
		});

		this.views.stop_page_view.model.url = url;
		this.views.stop_page_view.model.set('tripId', tripId, {silent: true});

		this.views.stop_page_view.trigger('ready');

		this.collections.lodgings_collection.fetchDebounced();

		this.router.navigate(url);
		Backbone.trigger('stop_view:render');
		ga('send', 'pageview', '/stops');
	}

});

module.exports = ViewOrchestrator;