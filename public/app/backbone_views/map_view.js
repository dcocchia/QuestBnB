var map_view = Backbone.View.extend({
	mapMarkers: [],
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

	setMarker: function(opts) {
		var marker = new google.maps.Marker({
			map: this.map,
			position: opts.location
		});

		this.mapMarkers.push(marker);
	},

	clearMarkers: function() {
		_.each(this.mapMarkers, function(marker) {
			marker.setMap(null);
		});

		this.mapMarkers = [];
	},

	setMode: function(modeClass) {
		this.$el.removeClass("trip-view stop-view stops-view overview-view").addClass(modeClass);
	}
});

module.exports = map_view;