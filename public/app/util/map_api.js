var Promise = require("bluebird");
//App only uses single instance of Map, so forgiving this-dot usage inside constructor
function Map(map) {
	this.map = map;

	this.autocompleteService = new google.maps.places.AutocompleteService({
		componentRestrictions: { 
			country: "us"
		}
	});

	this.placeService = new google.maps.places.PlacesService(map);
	this.directionsDisplay = new google.maps.DirectionsRenderer();
	this.directionsService = new google.maps.DirectionsService();
	this.geocoder = new google.maps.Geocoder();
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

	renderDirections: function(opts, promise) {
		var renderPromise = new Promise(_.bind(function(resolve, reject) {

			this.directionsDisplay.setMap(this.map);
			this.directionsService.route(opts, _.bind(function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					this.directionsDisplay.setDirections(result);
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
		
	}
}

module.exports = Map;