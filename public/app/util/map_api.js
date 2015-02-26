define(function(require) {
	//App only uses single instance of Map, so forgiving this-dot usage inside constructor
	function Map() {
		this.service = new google.maps.places.AutocompleteService({
			componentRestrictions: { 
				country: "us"
			}
		})
	}

	Map.prototype = {
		getQueryPredictions: function(opts, callback) {
			this.service.getQueryPredictions(opts, callback);
		}
	}

	return Map;
});