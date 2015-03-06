var locationsMenu = require("../../views/LocationsMenu");
var renderer = require("../../../renderer/client_renderer");

var LandingView = Backbone.View.extend({
	_findElms: function() {
		this.elms.$searchBox = this.$(".search-box");
		this.elms.$locationsMenu = this.elms.$searchBox.find(".locations-menu");
		this.elms.$locationInput = this.elms.$searchBox.find(".form-control.location");
		this.elms.$startCalendar = this.elms.$searchBox.find(".form-control.date.start");
		this.elms.$endCalendar = this.elms.$searchBox.find(".form-control.date.end");
	},

	elms: {},

	events: {
		"keyup .form-control.location": "onLocationKeyup",
		"keydown .form-control.location": "onLocationKeydown",
		"click .location-item": "onLocationItemClick",
		"focusin .form-control.location": "renderSearchResults",
		"focusin .form-control.date": "onCalendarInputFocus"
	},

	initialize: function(opts) {
		opts || (opts = {});

		this._findElms();

		this.model.on("change", _.bind(this.renderSearchResults, this));

		this.sendQuery = _.debounce( _.bind( function(options) {
			this.model.getQueryPredictions(options);
		}, this), 500);
	},

	onLocationKeydown: function(e) {
		var $active;

		if (e.keyCode === 13) {
			if (e && e.preventDefault) { e.preventDefault(); }

			$active = this.elms.$locationsMenu.find(".location-item.active");

			if ($active.length > 0) {
				$active.click();
			}
		}
	},

	onLocationKeyup: function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }

		switch(e.keyCode) {
			case 40:
				this.showLocationMenu();
				this.focusNextLocationItem();
				break;
			case 38:
				this.showLocationMenu();
				this.focusPrevLocationItem();
				break;
			default: 
				this.locationSearch(e);
				break;
		}
		
	},

	locationSearch: function(e) {
		var input = e.currentTarget,
			value = input.value;		

		if (value) { this.sendQuery({input: value}); }
	},

	showLocationMenu: function() {
		this.elms.$locationsMenu.removeClass("hide");
		this.elms.$locationsMenu.attr("aria-expanded", "true");
	},

	hideLocationMenu: function() {
		this.elms.$locationsMenu.addClass("hide");
		this.elms.$locationsMenu.attr("aria-expanded", "false");
	},

	focusNextLocationItem: function() {
		var $locationItems = this.elms.$locationsMenu.find(".location-item"),
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

	focusPrevLocationItem: function() {
		var $locationItems = this.elms.$locationsMenu.find(".location-item"),
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

	renderSearchResults: function() {
		var status = this.model.get("queryStatus");
		switch(status) {
			case "OK":
				renderer.render(locationsMenu, {predictions: this.model.get("queryPredictions")}, this.elms.$locationsMenu[0]);
				this.showLocationMenu();
				break;
			case "noResults":
				this.hideLocationMenu();
				break;
			default:
				this.hideLocationMenu();
				console.warn("Google Query Failure: ", status);
				break;
		}
	},

	onLocationItemClick: function(e) {
		var item = e.currentTarget,
			$item = this.$(item),
			placeDescription = $item.attr("data-place-description");

		if (e && e.preventDefault) { e.preventDefault(); }

		this.elms.$locationInput.val(placeDescription);
		this.elms.$startCalendar.focus();
	},

	onCalendarInputFocus: function(e) {
		var input = e.currentTarget,
			$item = this.$(input),
			calendar = $item.attr("data-calendar");

		if (e && e.preventDefault) { e.preventDefault(); }

		this.showCalendar(calendar);
	},

	showCalendar: function(calendar) {
		if (calendar === "end") {
			this.hideCalendar("start");
			this.hideLocationMenu();
		} else {
			this.hideCalendar("end");
			this.hideLocationMenu();
		}
	},

	hideCalendar: function(calendar) {

	}

});

module.exports = LandingView;
