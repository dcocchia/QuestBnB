//App only uses single instance of Map, so forgiving this-dot usage inside constructor
function Map(map) {
	this.autocompleteService = new google.maps.places.AutocompleteService({
		componentRestrictions: { 
			country: "us"
		}
	});

	this.placeService = new google.maps.places.PlacesService(map);
}

Map.prototype = {
	getQueryPredictions: function(opts, callback) {
		this.autocompleteService.getQueryPredictions(opts, callback);
	},

	getPlaceDetails: function(opts, callback) {
		this.placeService.getDetails(opts, callback);
	}
}

module.exports = Map;