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

		this.model.once("sync", _.bind(function(data){
			this.stops_collection = new opts.stops_collection;
			this.stops_collection.add(this.model.get("stops"));

			//TODO: since new stops are in collection, on render they aren't in model
			this.stops_collection.on("change", _.bind(function(data){
				this.render(trip_template);
			}, this));

			this.createStopViews();
		}, this));

		this.model.on("change", _.bind(function() {
			this.render(trip_template);
			this.map_view.setMode("trip-view");
		}, this));

		Backbone.on("trip_view:render", _.bind(function(){
			this.render(trip_template);
			this.map_view.setMode("trip-view");
		}, this));

		this._findElms(opts.$parentEl);

	},

	createStopViews: function() {
		_.each(this.stops_collection.models, function(stopModel) {
			new StopView({
				model: stopModel,
				el: ".stop[data-stop-id='" + stopModel.get("_id") + "']"
			});
		});
	},

	onAddStopClick: function(e) {
		var stopIndex = $(e.currentTarget).closest(".stop").data("stopIndex");

		if (e.preventDefault) { e.preventDefault(); }

		if (_.isNumber(stopIndex) ) {
			this.stops_collection.addStop(stopIndex + 1, {isNew: true, stopNum: stopIndex + 2, _id: _.uniqueId("stop__") });
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
	}
});

module.exports = TripView;