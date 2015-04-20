var map_view = Backbone.View.extend({
	events: {},
	initialize: function(opts) {
		this.createMap();
	},

	createMap: function() {
		var mapOptions = {
			zoom: 5,
			center: new google.maps.LatLng(38, -97),
			disableDefaultUI: true
		}

		this.map = new google.maps.Map(this.$("#goog_map")[0], mapOptions);
	},

	setCenter: function(opts) {
		var pos = new google.maps.LatLng(opts.lat, opts.long);
		this.map.setCenter(pos);
	},

	setZoom: function(zoomLevel) {
		this.map.setZoom(zoomLevel);
	},

	setMode: function(modeClass) {
		this.$el.removeClass("trip-view stop-view").addClass(modeClass);
	}
});

module.exports = map_view;