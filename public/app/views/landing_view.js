$(function() {
	define(function(require) {
		var LandingView = Backbone.View.extend({
			events: {
				"keyup .location": "locationSearch",
				"focusout .location": "onLocationFocusOut"
			},

			initialize: function(opts) {
				opts || (opts = {});
				this.map_api = opts.map_api;

				this.sendQuery = _.debounce( _.bind( function(options, callback) { 
					this.map_api.getQueryPredictions(options, callback); 
				}, this), 500);
			},

			locationSearch: function(e) {
				var input = e.currentTarget,
					value = input.value;

				if (e && e.preventDefault) { e.preventDefault(); }

				if (value) { this.sendQuery({input: value}, this.renderSearchResults); }
			},

			renderSearchResults: function(predictions, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					//render
					console.log(predictions);	
				} else {
					console.warning("Google Query Failure: ", status);
				}
			}
	
		});

		return LandingView;
	});
});