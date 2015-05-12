var Promise = require("bluebird");
//App only uses single instance of Map, so forgiving this-dot usage inside constructor
function Map(map) {
	this.map = map;
	this.markers = [];

	this.autocompleteService = new google.maps.places.AutocompleteService({
		componentRestrictions: { 
			country: "us"
		}
	});

	this.placeService = new google.maps.places.PlacesService(map);
	this.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
	this.directionsService = new google.maps.DirectionsService();
	this.geocoder = new google.maps.Geocoder();
	this.infowindow = new google.maps.InfoWindow({});
	this.bounds = new google.maps.LatLngBounds();
}

Map.prototype = {
	getQueryPredictions: function(opts, callback) {
		this.autocompleteService.getQueryPredictions(opts, callback);
	},

	getPlaceDetails: function(opts, callback) {
		this.placeService.getDetails(opts, callback);
	},

	reverseGeoCode: function(opts, callback) {
		this.geocoder.geocode(opts, callback);
	},

	triggerMapResize: function() {
		google.maps.event.trigger(this.map, 'resize');
	},

	makeMarker: function(position, icon, title, id) {
		var marker = new google.maps.Marker({
			position: position,
			map: this.map,
			icon: icon,
			title: title
		});

		if (title) {
			google.maps.event.addListener(marker, 'click', _.bind(function() {
				this.infowindow.setContent(title);
				this.infowindow.open(this.map, marker);
			}, this));
		}

		if (id) { marker.set("id", id); }

		this.markers.push(marker);
	},

	clearMarkers: function() {
		_.each(this.markers, function(marker) {
			marker.setMap(null);
		});

		this.markers = [];
	},

	clearDirections: function() {
		this.directionsDisplay.setMap(null);
	},

	generateMarkerIcon: function(opts) {
		var iconUrl = "";
		var baseUrl = "http://mt.google.com/vt/icon";
		var defaults = {
			fontSize: 16,
			font: "arialuni_t.ttf",
			textColor: "ffffffff",
			backgroundColor: "red",
			xPos: 41,
			yPos: 48,
			text: "%E2%80%A2"
		}
		var options;
		
		opts || (opts = {});

		options = _.defaults(opts, defaults);

		iconUrl += baseUrl;
		iconUrl += "?psize=" + options.fontSize;
		iconUrl += "&font=fonts/" + options.font;
		iconUrl += "&color=" + options.textColor;
		iconUrl += "&name=" + (
			options.backgroundColor === "red" 
			? "icons/spotlight/spotlight-waypoint-b.png" 
			: "icons/spotlight/spotlight-waypoint-blue.png"
		);
		iconUrl += "&ax=" + options.xPos;
		iconUrl += "&ay=" + options.yPos;
		iconUrl += "&text=" + options.text;

		return iconUrl
	},

	placeDirectionMarkers: function(legs) {
		this.clearMarkers();
		_.each(legs, _.bind(function(leg, index, legs) {
			this.makeMarker(leg.start_location, this.generateMarkerIcon({text: index + 1}), leg.start_address);
			if (index + 1 === legs.length) {
				this.makeMarker(leg.end_location, this.generateMarkerIcon({text: index + 2}), leg.end_address);
			}
		}, this));
	},

	renderDirections: function(opts, promise) {
		var renderPromise = new Promise(_.bind(function(resolve, reject) {

			this.directionsDisplay.setMap(this.map);
			this.directionsService.route(opts, _.bind(function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					this.directionsDisplay.setDirections(result);
					this.placeDirectionMarkers(result.routes[0].legs);
					resolve(result);
				} else {
					reject(status);
				}
			}, this));

		}, this));

		return renderPromise;
	},

	renderDirectionsFromStopsCollection: function(stops_collection) {
		var request;
		var stops = stops_collection.toJSON();
		var waypoints = stops.slice(1, -1);

		_.each(waypoints, function(waypoint, index) {
			waypoints[index] = { location: waypoint.location };
		});

		if (stops && stops.length > 0) {
				request = {
				origin: _.first(stops).location,
				destination: _.last(stops).location,
				waypoints: waypoints,
				provideRouteAlternatives: false,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.IMPERIAL
			};

			return this.renderDirections(request);
		} else {
			var promise = new Promise(function(resolve, reject) {
				reject();
			});

			return promise;
		}
		
	},

	fitMapBoundsToMarkers: function() {
		this.bounds = new google.maps.LatLngBounds();

		_.each(this.markers, _.bind(function(marker) {
			this.bounds.extend(marker.getPosition());
		},this));

		this.map.fitBounds(this.bounds);
	},

	placeLodgingsMapMarkers: function(lodgings_collection) {
		var attr;
		var geo;
		var position;
		var icon;
		var title;
		var id;

		this.clearMarkers();

		_.each(lodgings_collection.models, _.bind(function(lodging, index) {
			attr = lodging.get('attr');
			geo = lodging.get('latLng');

			if (geo) {
				position = {
					lat: geo[0],
					lng: geo[1]
				}
			}

			icon = this.generateMarkerIcon();

			if (attr) { title = attr.heading; }

			id = lodging.get("id");

			this.makeMarker(position, icon, title, id);
		}, this));

		this.fitMapBoundsToMarkers();
		
	}
}

module.exports = Map;