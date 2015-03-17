var PageView = require("./page_view");
var trip_template = require("../../views/TripView");

var TripView = PageView.extend({

	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
		this.elms.$stops = this.$(".stops");
	},

	events: {
		"click .add-stop-btn": "onAddStopClick",
		"blur .title": "onTitleBlur",
		"keydown .title": "onTitleKeyDown"
	},

	initialize: function(opts) {
		var tripId = this.$el.attr("data-trip-id");

		this.map_api = opts.map_api;
		this.map_view = opts.map_view;

		this.model.on("change", _.bind(function() {
			this.render(trip_template);
			this.map_view.setMode("trip-view");
		}, this));

		Backbone.on("trip_view:render", _.bind(function(){
			this.render(trip_template);
			this.map_view.setMode("trip-view");
		}, this));

		this._findElms(opts.$parentEl);

		this.model.setUrl(tripId);

		this.model.fetch();

	},

	onAddStopClick: function(e) {
		var stopIndex = $(e.currentTarget).closest(".stop").data("stopIndex");

		if (e.preventDefault) { e.preventDefault(); }

		if (_.isNumber(stopIndex) ) {
			this.model.addStop(stopIndex + 1, {isNew: true, stopNum: stopIndex + 2, _id: _.uniqueId() });
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

	onTitleKeyDown: function(e) {
		if (e && e.keyCode === 13) {
			if (e.preventDefault) { e.preventDefault(); }
			$(e.currentTarget).blur()
		}
	}
});

module.exports = TripView;