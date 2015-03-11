var PageView = require("./page_view");
var trip_template = require("../../views/TripView");

var TripView = PageView.extend({
	initialize: function(opts) {
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

	}
});

module.exports = TripView;