var search_model = require("../backbone_models/search_model");

StopView = Backbone.View.extend({
	events: {
		"keydown .stop-location-title": "onEditKeyDown",
		"keyup .stop-location-title": "onEditKeyup",
		"blur .stop-location-title": "onLocationTitleBlur",
		"click .location-item": "onLocationItemClick",
		"click .clear": "onClearClick"
	},

	initialize: function(opts) {
		this.map_api = opts.map_api;
		this.search_model = new search_model({
			map_api: this.map_api
		});

		this.model.on("active", _.bind(function() {
			this.focus();
		}, this));

		this.search_model.on("change", _.bind(function() {
			Backbone.trigger("trip_view:location_search", this.search_model, this.model);
		}, this));

		this.sendQuery = _.debounce( _.bind( function(options) {
			this.search_model.getQueryPredictions(options);
		}, this), 500);
		
	},

	onLocationTitleBlur: function(e) {
		var target = e.currentTarget,
			text = (target && target.textContent && typeof(target.textContent) != "undefined") ? target.textContent : target.innerText;

		//TODO: save to db
		console.log(text);
	},

	onEditKeyDown: function(e) {
		if (e && e.keyCode === 13) {
			if (e.preventDefault) { e.preventDefault(); }
			$(e.currentTarget).blur();
			this.clearAllRanges();
			this.search_model.clear();
		}
	},

	onEditKeyup: function(e) {
		var target = e.currentTarget;

		if (e && e.preventDefault) { e.preventDefault(); }

		switch(e.keyCode) {
			case 40:
				this.focusNextLocationItem(target);
				break;
			case 38:
				this.focusPrevLocationItem(target);
				break;
			default: 
				this.locationSearch(e);
				break;
		}
		
	},

	focusNextLocationItem: function(target) {
		var $locationsMenu = $(target).siblings(".locations-menu"),
			$locationItems = $locationsMenu.find(".location-item"),
			$activeItem = $locationItems.filter(".active"),
			$next;

		if ($activeItem.length <= 0) {
			$locationItems.first().addClass("active");
		} else {
			$next = $activeItem.removeClass("active").next();

			if ($next.length <= 0) {
				$locationItems.first().addClass("active");
			} else {	
				$next.addClass("active");
			}
			
		}
	},

	focusPrevLocationItem: function(target) {
		var $locationsMenu = $(target).siblings(".locations-menu"),
			$locationItems = $locationsMenu.find(".location-item"),
			$activeItem = $locationItems.filter(".active"),
			$prev;

		if ($activeItem.length <= 0) {
			$locationItems.last().addClass("active");
		} else {
			$prev = $activeItem.removeClass("active").prev();

			if ($prev.length <= 0) {
				$locationItems.last().addClass("active");
			} else {	
				$prev.addClass("active");
			}
		}
	},

	locationSearch: function(e) {
		var target = e.currentTarget,
			text = (target && target.textContent && typeof(target.textContent) != "undefined") ? target.textContent : target.innerText;		

		if (text) { this.sendQuery({input: text}); }
	},

	onLocationItemClick: function(e) {
		var item = e.currentTarget,
			$item = this.$(item),
			placeDescription = $item.attr("data-place-description"),
			placeId = $item.attr("data-place-id"),
			offset_y = -0.7,
			offset_x = 0;

		if (e && e.preventDefault) { e.preventDefault(); }

		this.map_api.getPlaceDetails({placeId: placeId}, function(place, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK ) {
				Backbone.trigger("map:setMarker", {
					location: place.geometry.location
				});

				//TODO: set model with new location, re-render page
			}
		});

	},

	onClearClick: function(e) {
		var $target = this.$(e.currentTarget).siblings(".stop-location-title");

		if (e.preventDefault) { e.preventDefault(); }

		$target.text("");
	},

	clearAllRanges: function() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection.createRange) {
			var range = document.selection.createRange();
			document.selection.empty();
		}
	},

	focus: function(stop) {
		this.$(".stop-location-title").focus();
	}
});

module.exports = StopView;