;(function(window){
	var React 					= require('react');
	var moment 					= require('moment');
	
	require('moment-duration-format');
	window.moment 				= moment;
	window.React 				= React;

	//view/event orchestrator
	var View_orchestrator 		= require('./util/view_orchestrator');

	//map
	var Map_api 				= require('./util/map_api');
	var Map_view 				= require('./backbone_views/map_view');

	//backbone views
	var Header_view 			= require('./backbone_views/header_view');
	var Landing_view 			= require('./backbone_views/landing_view');
	var Trip_view 				= require('./backbone_views/trip_view');
	var Stop_page_view 			= require('./backbone_views/stop_page_view');

	//backbone collections
	var Stops_collection 		= require('./backbone_collections/stops_collection');
	var Travellers_collection 	= require('./backbone_collections/travellers_collection');
	var Lodgings_collection 	= require('./backbone_collections/lodgings_collection');

	//backbone models
	var Header_model 			= require('./backbone_models/header_model');
	var Search_model 			= require('./backbone_models/search_model');
	var Trip_model 				= require('./backbone_models/trip_model');
	var Stop_model 				= require('./backbone_models/stop_model');
	var Lodgings_meta_model		= require('./backbone_models/lodgings_meta_model');


	var Router = Backbone.Router.extend({ 
		routes: {
			''							: 'landing',
			'trips/:id'					: 'trip',
			'trips/:id/'				: 'trip',
			'trips/:id/stops/:stopId'	: 'stop',
			'trips/:id/stops/:stopId/'	: 'stop'
		}
	});

	var App = View_orchestrator.extend({
		initialize: function(opts) {
			this.router = opts.router;
			this.models = {};
			this.views = {};
			this.collections = {};
			this.loadView(Header_view, 'header_view', {
				$parentEl: $('.header-nav-wrapper'),
				el: $('.header-nav'), 
				model: this.loadModel(Header_model, 'header_model')
			});
			this.loadView(Map_view, 'map_view', { el: $('.map')});
			this.map_api = new Map_api(this.views.map_view.map);
			this.setRouteListeners();
			this.startOrchestrator({
				Models: {
					search_model: Search_model,
					trip_model: Trip_model,
					lodgings_meta_model: Lodgings_meta_model,
					stop_model: Stop_model
				},
				Views: {
					landing_view: Landing_view,
					trip_view: Trip_view,
					stop_page_view: Stop_page_view
				},
				Collections: {
					stops_collection: Stops_collection,
					travellers_collection: Travellers_collection,
					lodgings_collection: Lodgings_collection
				}
			});
			
			Backbone.history.start({pushState: "pushState" in window.history});
		},

		setRouteListeners: function() {
			this.router.on('route:landing', _.bind( function() {
				this.loadModel(Search_model, 'search_model', {
					map_api: this.map_api
				});
				this.loadView(Landing_view, 'landing_view', { 
					$parentEl: this.$el,
					el: $('.landing-page'), 
					map_api: this.map_api,
					map_view: this.views.map_view,
					model: this.models.search_model
				});
				Backbone.trigger('landing_view:render');
				ga('send', 'pageview', '/landing');
			}, this));

			this.router.on('route:trip', _.bind( function(tripId) { 
				this.loadModel(Trip_model, 'trip_model');
				this.models.trip_model.setUrl(tripId);
				
				this.loadView(Trip_view, 'trip_view', {
					$parentEl: this.$el, 
					el: $('.trip-page'), 
					map_api: this.map_api,
					map_view: this.views.map_view,
					model: this.models.trip_model,
					stops_collection: Stops_collection,
					travellers_collection: Travellers_collection
				});

				this.models.trip_model.fetch({
					success: _.bind(function() {
						this.models.trip_model.trigger('ready');
					}, this)
				});
				ga('send', 'pageview', '/trips');
			}, this));

			this.router.on('route:stop', _.bind(function(tripId, stopId) {
				this.loadModel(Trip_model, 'trip_model');
				this.loadModel(Lodgings_meta_model, 'lodgings_meta_model');
				this.loadCollection(
					Lodgings_collection, 
					'lodgings_collection',
					[
						[],
						{
							url: '/lodgings',
							lodgings_meta_model: this.models.lodgings_meta_model
						}
					]
				);

				this.loadView(Stop_page_view, 'stop_page_view', {
					$parentEl: this.$el,
					el: $('.stop-page'),
					map_api: this.map_api,
					map_view: this.views.map_view,
					model: new Stop_model({
						url: '/trips/' + tripId + '/stops/' + stopId
					}),
					trip_model: this.models.trip_model,
					lodgings_collection: this.collections.lodgings_collection
				})._bootStrapView();
				ga('send', 'pageview', '/stops');
			}, this));
		},

		loadView: function(view, viewName, options) {
			return this._load(view, 'views', viewName, options);
		},

		loadModel: function(model, modelName, options) {
			return this._load(model, 'models', modelName, options);
		},

		loadCollection: function(collection, collectionName, options) {
			return this._load(
				collection, 
				'collections', 
				collectionName, 
				options
			);
		},

		_load: function(Obj, type, name, options) {
			var ref = this[type][name];
			if (_.isArray(options)) {
				if (ref) {
					ref.initialize.apply(ref, options);
				} else {
					this[type][name] = new Obj(options[0], options[1]);
				}

				return ref;
			} else {
			
				if (ref) {
					ref.initialize(options);
				} else {
					this[type][name] = new Obj(options);
				}

				return this[type][name];
			}
		}
	});

	$(function() { 
		new App({
			router: new Router(),
			el: $('.page-view')
		});
	});
})(window);