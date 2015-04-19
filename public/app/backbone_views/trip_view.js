var PageView = require("./page_view");
var StopView = require("./stop_view");
var TravellerView = require("./traveller_view");
var trip_template = require("../../views/TripView");

var TripView = PageView.extend({

	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
	},

	elms: {},

	events: {
		"click .add-stop-btn"			: "onAddStopClick",
		"click .add-traveller"			: "onAddTravellerClick",
		"blur .title"					: "onTitleBlur",
		"keydown .title"				: "onEditKeyDown",
		"click .trip-blurb.editable h3"	: "onTripBlurbClick",
		"change .gas-slider"			: "onGasSliderChange",
		"input .gas-slider"				: "onGasSliderChange"
	},

	initialize: function(opts) {
		this.map_api = opts.map_api;
		this.map_view = opts.map_view;
		this.stop_views = [];
		this.travellers_views = [];

		this.map_api.clearMarkers();

		this.model.once("ready", _.bind(function(data){
			//stops collection and related
			this.stops_collection = new opts.stops_collection;
			this.stops_collection.add(this.model.get("stops"));
			//this.map_api.renderDirectionsFromStopsCollection(this.stops_collection);
			this.renderNewMapStop();
			this.createStopViews();

			this.stops_collection.on("change", _.bind(function(stopModel){
				this.setStopsCollectionInModel();
				this.render(trip_template);
				
				if (stopModel && stopModel.get && stopModel.get("isNew") === true) {
					this.createNewStopView(stopModel);
				} else if (!stopModel || stopModel.get("location") !== "") {
					this.renderNewMapStop();
				}
			}, this));

			//travellers collection and related
			this.travellers_collection = new opts.travellers_collection();
			this.travellers_collection.add(this.model.get("travellers"));
			this.createTravellersViews();

			this.travellers_collection.on("change", _.bind(function() {
				this.setTravellersCollectionInModel({sync: true});
			}, this));

			this.travellers_collection.on("add", _.bind(function(travellerModel) {
				//view will call sync on model once user types in traveller name
				//so, passing false flag here
				this.setTravellersCollectionInModel({sync: false});
				this.createNewTravellerView(travellerModel, {isNew: true});
			}, this));

			this.travellers_collection.on("remove", _.bind(function(travellerModel) {
				this.setTravellersCollectionInModel({sync: true});
				this.removeTravellerView(travellerModel);
			}, this));
			
		}, this));

		this.model.on("change", _.bind(function() {
			this.render(trip_template);
			this.map_view.setMode("trip-view");
		}, this));

		Backbone.on("trip_view:location_search", _.bind(function(location_model, stop_model) {
			var data = {};

			location_model || (location_model = {});
			stop_model || (stop_model = {});

			data.location_props = location_model.toJSON();
			data.stop_props = stop_model.toJSON();

			this.render(trip_template, data);
		}, this));

		Backbone.on("TripView:render", _.bind(function() {
			//rebind date pickers, but wait for renders to finish
			this.bindDatePickersDebounced();
		}, this));

		Backbone.on("removeStop", _.bind(function(stopId) {
			var view = _.find(this.stop_views, function(view, index) {
				return view.stopId === stopId;
			});

			if (view) { view.destroy(); }
		}, this));

		this._findElms(opts.$parentEl);

		this.bindDatePickers();

	},

	bindDatePickers: function() {
		var $dateWrapper = this.$(".trip-dates-wrapper");

		$dateWrapper.find(".date.start").datepicker({
			minDate: 0,
			onSelect: _.bind( function(resp) {
				//re calc stuff
				//then save to model
			}, this)
		});
		$dateWrapper.find(".date.end").datepicker({
			minDate: 0,
			onSelect: _.bind( function(resp) {
				//re calc stuff
				//then save to model
			}, this)
		});
	},

	bindDatePickersDebounced: _.debounce(function() { 
		this.bindDatePickers();
	}, 500),

	setStopsCollectionInModel: function() {
		this.model.set("stops", this.stops_collection.toJSON(), {silent: true});
	},

	setTravellersCollectionInModel: function(opts) {
		opts || (opts = {});
		this.model.set("travellers", this.travellers_collection.toJSON());
		if (opts.sync) {
			this.model.sync("update", this.model, {url: this.model.url});
		}
	},

	createStopViews: function() {
		_.each(this.stops_collection.models, _.bind(function(stopModel) {
			this.createNewStopView(stopModel);
		}, this));
	},

	createNewStopView: function(stopModel) {
		this.stop_views.push( 
			new StopView({
				model: stopModel,
				map_api: this.map_api,
				el: ".stop[data-stop-id='" + stopModel.get("_id") + "']",
				stopId: stopModel.get("_id")
			})
		);
	},

	createTravellersViews: function() {
		_.each(this.travellers_collection.models, _.bind(function(travellerModel) {
			this.createNewTravellerView(travellerModel);
		}, this));
	},

	createNewTravellerView: function(travellerModel, opts) {
		opts || (opts = {});
		this.travellers_views.push(
			new TravellerView({
				model: travellerModel,
				el: ".traveller[data-traveller-id='" + travellerModel.get("_id") + "']",
				travellerId: travellerModel.get("_id"),
				isNew: opts.isNew || false
			})
		);
	},

	removeTravellerView: function(travellerModel) {
		var id = travellerModel.get("_id");

		var view = _.find(this.travellers_views, _.bind(function(view, index) {
			if (view && view.travellerId === id) {
				this.travellers_views.splice(index, 1);
				return true;
			}
		}, this));

	},

	onAddStopClick: function(e) {
		var stopIndex = $(e.currentTarget).closest(".stop").data("stopIndex");

		if (e.preventDefault) { e.preventDefault(); }

		if (_.isNumber(stopIndex) ) {
			this.stops_collection.addStop(stopIndex + 1, {
				isNew: true, 
				stopNum: stopIndex + 2, 
				_id: _.uniqueId("stop__") 
			});
		}
		
	},

	onAddTravellerClick: function(e) {
		e.preventDefault();

		this.travellers_collection.add({
			_id: _.uniqueId("traveller__") 
		});
	},

	onTitleBlur: function(e) {
		var target = e.currentTarget,
			text = (target && target.textContent && typeof(target.textContent) != "undefined") ? target.textContent : target.innerText;

		if (this.model.get("title") !== text) {
			this.model.set("title", text);
			this.model.saveLocalStorageReference();
			this.model.sync("update", this.model, {url: this.model.url});
		}
		
	},

	onTripBlurbClick: function(e) {
		var $target = $(e.currentTarget);

		if (e.preventDefault) { e.preventDefault(); }

		$target.closest(".trip-blurb").toggleClass("active");
	},

	onEditKeyDown: function(e) {
		if (e && e.keyCode === 13) {
			if (e.preventDefault) { e.preventDefault(); }
			$(e.currentTarget).blur();
			this.clearAllRanges();
		}
	},

	onGasSliderChange: function(e) {
		var $target = $(e.currentTarget),
			val = $target.val(),
			modelAttr = $target.data("model-attr"),
			toFixAttr = $target.data("to-fixed");

		if (toFixAttr) {
			val = parseFloat(val).toFixed(parseInt(toFixAttr));
		}	

		this.setModelThrottle(modelAttr, val);
	},	

	clearAllRanges: function() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection.createRange) {
			var range = document.selection.createRange();
			document.selection.empty();
		}
	},

	renderNewMapStop: function() {
		this.map_api.renderDirectionsFromStopsCollection(this.stops_collection)
		.then(_.bind(function(result) {
			this.setViewNewMapStop(result);
		}, this));
	},

	setViewNewMapStop: function(result) {
		this.stops_collection.mergeMapData(result);
		this.setStopsCollectionInModel();
		this.setModel(null, {silent: true});
		this.render(trip_template);
		this.model.sync("update", this.model, { url: this.model.url });
	},

	setModelThrottle: _.throttle(function(modelAttr, val) {
		this.model.set(modelAttr, val, {silent: true});
		this.setModel();
		this.syncModelDebounced();
	}, 100),

	syncModelDebounced: _.debounce(function() {
		this.model.sync("update", this.model, { url: this.model.url });
	}, 700),

	setModel: function(opts, setOpts) {
		var data;
		var distance = this.stops_collection.last().get("totals").distance.value;
		var duration = this.stops_collection.last().get("totals").duration.text;
		var cost = ((distance / this.model.get("mpg")) * this.model.get("gasPrice")).toFixed(2);

		var defaults = {
			tripDistance: distance,
			tripDuration: duration,
			numStops: this.stops_collection.length - 1,
			cost: cost
		}

		opts || (opts = {});
		data = _.defaults(opts, defaults);

		this.model.set(data, setOpts);
	}
});

module.exports = TripView;