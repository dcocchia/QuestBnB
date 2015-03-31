var PageView = require("./page_view");
var StopView = require("./stop_view");
var trip_template = require("../../views/TripView");

var TripView = PageView.extend({

	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
		this.elms.$stops = this.$(".stops");
	},

	events: {
		"click .add-stop-btn": "onAddStopClick",
		"blur .title": "onTitleBlur",
		"keydown .title": "onEditKeyDown"
	},

	initialize: function(opts) {
		this.map_api = opts.map_api;
		this.map_view = opts.map_view;
		this.views = [];

		this.model.once("sync", _.bind(function(data){
			this.stops_collection = new opts.stops_collection;
			this.stops_collection.add(this.model.get("stops"));
			this.map_api.renderDirectionsFromStopsCollection(this.stops_collection);
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

		Backbone.on("removeStop", _.bind(function(stopId) {
			var view = _.find(this.views, function(view, index) {
				return view.stopId === stopId;
			});

			if (view) { view.destroy(); }
		}, this))

		this._findElms(opts.$parentEl);

	},

	setStopsCollectionInModel: function() {
		this.model.set("stops", this.stops_collection.toJSON(), {silent: true});
	},

	createStopViews: function() {
		_.each(this.stops_collection.models, _.bind(function(stopModel) {
			this.views.push( 
				new StopView({
					model: stopModel,
					map_api: this.map_api,
					el: ".stop[data-stop-id='" + stopModel.get("_id") + "']",
					stopId: stopModel.get("_id")
				})
			);
		}, this));
	},

	createNewStopView: function(stopModel) {
		this.views.push( 
			new StopView({
				model: stopModel,
				map_api: this.map_api,
				el: ".stop[data-stop-id='" + stopModel.get("_id") + "']",
				stopId: stopModel.get("_id")
			})
		);
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

	onTitleBlur: function(e) {
		var target = e.currentTarget,
			text = (target && target.textContent && typeof(target.textContent) != "undefined") ? target.textContent : target.innerText;

		if (this.model.get("title") !== text) {
			this.model.set("title", text);
			this.model.sync("update", this.model, {url: this.model.url});
		}
		
	},

	onEditKeyDown: function(e) {
		if (e && e.keyCode === 13) {
			if (e.preventDefault) { e.preventDefault(); }
			$(e.currentTarget).blur();
			this.clearAllRanges();
		}
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
			this.stops_collection.mergeMapData(result);
			this.setStopsCollectionInModel();
			this.setModel();
			this.render(trip_template);
			this.model.sync("update", this.model, { url: this.model.url });
		}, this));
	},

	setModel: function() {
		var distance = this.stops_collection.last().get("totals").distance.value;
		var duration = this.stops_collection.last().get("totals").duration.text;
		var cost = ((distance / this.model.get("mpg")) * this.model.get("gasPrice")).toFixed(2);

		this.model.set({
			tripDistance: distance,
			tripDuration: duration,
			numStops: this.stops_collection.length - 1,
			cost: cost
		}, {silent: true});	
	}
});

module.exports = TripView;