var renderer = require("../../../renderer/client_renderer");

var TripView = Backbone.View.extend({
	initialize: function(opts) {
		this.map_api = opts.map_api;

		this.model.on("change", _.bind(this.render, this));
	},

	render: function() {
		
	}
});

module.exports = TripView;