var Promise = require('bluebird');
var PageView = require('./page_view');
var landing_template = require('../../views/LandingView');
var locationsMenu = require('../../views/LocationsMenu');
var renderer = require('../../../renderer/client_renderer');
var moment = require('moment');

var LandingView = PageView.extend({
	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
		this.elms.$searchArea = this.$('.search-area');
		this.elms.$searchBox = this.elms.$searchArea.find('.search-box');
		this.elms.$searchForm = this.elms.$searchBox.find('.search-form');
		this.elms.$locationsMenu = this.elms.$searchBox.find('.locations-menu');
		this.elms.$locationInput = this.elms.$searchBox.find('.form-control.location');
		this.elms.$startCalendar = this.elms.$searchBox.find('.form-control.date.start');
		this.elms.$endCalendar = this.elms.$searchBox.find('.form-control.date.end');
		this.elms.$travellers = this.elms.$searchBox.find('.form-control.travellers');
		this.elms.$searchBtn = this.elms.$searchBox.find('.search-btn');
	},

	elms: {},

	events: {
		'keyup .form-control.location'		: 'onLocationKeyup',
		'keydown .form-control.location'	: 'onLocationKeydown',
		'click .location-item'				: 'onLocationItemClick',
		'focusin .form-control.location'	: 'renderSearchResults',
		'focusin .form-control.date'		: 'onCalendarInputFocus',
		'change .form-control.travellers'	: 'onTravellerChange',
		'submit .search-form'				: 'onSubmit'
	},

	initialize: function(opts) {
		opts || (opts = {});
		this.$parentEl = opts.$parentEl;
		
		this._findElms(this.$parentEl);

		//hack for autofocus React bug: https://github.com/facebook/react/issues/3066
		this.elms.$locationInput.focus();

		this.bindDatePickers();

		this.map_api = opts.map_api;
		this.map_view = opts.map_view;

		this.model.on('change', _.bind(this.renderSearchResults, this));

		Backbone.on('landing_view:render', _.bind(function() {
			this.map_view.setMode();
			this.map_api.clearMarkers();
			this.map_api.clearDirections();
			this.render(landing_template);
			this._findElms(this.$parentEl);
			this.bindDatePickers();
		}, this));

		this.sendQuery = _.debounce( _.bind( function(options) {
			this.model.getQueryPredictions(options);
		}, this), 500);

		this.storeClientGeo();
	},

	storeClientGeo: function() {
		var localGeo = localStorage.getItem('geo');
		var posObj;

		if (!localGeo && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				try{
					// safari and FF can't stringify a Geoposition instance
					// because the properties are on the prototype
					// this is an easy workaround
					posObj = {
						timestamp: position.timestamp,
						coords: {}
					};

					for (prop in position.coords) {
						posObj.coords[prop] = position.coords[prop];
					}

					localStorage.setItem('geo', JSON.stringify(posObj));
				} catch(e) {/* safari private mode fails localStorage set calls */}
			})
		}
	},

	getClientGeo: function() {
		var localGeo = localStorage.getItem('geo');
		try{
			return JSON.parse(localGeo);
		} catch(e) {/* json parse fail. Just move on. */}
	},

	reverseGeocodeClientGeo: function(clientGeo) {
		var clientGeo = localStorage.getItem('geoPlaceData');
		var latLng, localGeo, result;
		
		var geoPromise = new Promise(_.bind(function(resolve, reject) {
			localGeo = this.getClientGeo();

			if (!localGeo || _.isEmpty(localGeo)) {
				//user never accpeted geo request
				//or geolocation api not supported
				resolve();
			} else {
				if (!clientGeo) {
					latLng = new google.maps.LatLng(localGeo.coords.latitude, localGeo.coords.longitude);
					this.map_api.reverseGeoCode( { 'location': latLng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							result = results[0];
							localStorage.setItem('geoPlaceData', JSON.stringify(result));
							resolve(result);
						} else {
							reject(status);
						}
					});
				} else {
					resolve(JSON.parse(clientGeo));
				}
			}
		}, this));

		return geoPromise;
	},

	bindDatePickers: function() {
		this.elms.$startCalendar.datepicker({ 
			minDate: 0,
			onSelect: _.bind( function(resp) {
				var that = this;
				//delay for letting first calendar close
				//before opening the next one
				_.delay( function() {
					that.setStartDate(resp);
				}, 250);
			}, this)
		});
		this.elms.$endCalendar.datepicker({
			minDate: 0,
			onSelect: _.bind( function(resp) {
				this.setEndDate(resp);
			}, this)
		});
	},
	
	setStartDate: function(date) {
		var newStart = moment(this.elms.$startCalendar.datepicker('getDate'));
		var endDate = this.elms.$endCalendar.datepicker('getDate');

		if (newStart.isAfter(endDate)) {
			this.clearEndDate();
			return;
		}

		this.elms.$endCalendar.focus();
	},

	setEndDate: function(date) {
		var newEnd = moment(this.elms.$endCalendar.datepicker('getDate'));
		var startDate = this.elms.$startCalendar.datepicker('getDate');

		if (newEnd.isBefore(startDate)) {
			this.clearStartDate();
			return;
		}

		this.elms.$travellers.focus();
	},

	clearStartDate: function() {
		_.delay( _.bind(function() {
			this.elms.$startCalendar.focus().datepicker( "setDate", null );
		}, this), 250);
	},

	clearEndDate: function() {
		_.delay( _.bind(function() {
			this.elms.$endCalendar.focus().datepicker( "setDate", null );
		}, this), 250);
	},

	onLocationKeydown: function(e) {
		var $active;

		if (e.keyCode === 13) {
			if (e && e.preventDefault) { e.preventDefault(); }

			$active = this.elms.$locationsMenu.find('.location-item.active');

			if ($active.length > 0) {
				$active.click();
			} else {
				$active = this.elms.$locationsMenu.find('.location-item').first();
				$active.click();
			}
		}
	},

	onLocationKeyup: function(e) {
		if (e && e.preventDefault) { e.preventDefault(); }

		switch(e.keyCode) {
			case 40:
				//up arrow
				this.showLocationMenu();
				this.focusNextLocationItem();
				break;
			case 38:
				//down arrow
				this.showLocationMenu();
				this.focusPrevLocationItem();
				break;
			case 13: 
				//enter key
				this.onLocationKeydown(e);
				break;
			case 27: 
				//escape key
				$(e.currentTarget).blur();
				this.model.clear();
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
		this.elms.$locationsMenu.removeClass('hide');
		this.elms.$locationsMenu.attr('aria-expanded', 'true');
	},

	hideLocationMenu: function() {
		this.elms.$locationsMenu.addClass('hide');
		this.elms.$locationsMenu.attr('aria-expanded', 'false');
	},

	focusNextLocationItem: function() {
		var $locationItems = this.elms.$locationsMenu.find('.location-item'),
			$activeItem = $locationItems.filter('.active'),
			$next;

		if ($activeItem.length <= 0) {
			$locationItems.first().addClass('active');
		} else {
			$next = $activeItem.removeClass('active').next();

			if ($next.length <= 0) {
				$locationItems.first().addClass('active');
			} else {	
				$next.addClass('active');
			}
			
		}
		
	},

	focusPrevLocationItem: function() {
		var $locationItems = this.elms.$locationsMenu.find('.location-item'),
			$activeItem = $locationItems.filter('.active'),
			$prev;

		if ($activeItem.length <= 0) {
			$locationItems.last().addClass('active');
		} else {
			$prev = $activeItem.removeClass('active').prev();

			if ($prev.length <= 0) {
				$locationItems.last().addClass('active');
			} else {	
				$prev.addClass('active');
			}
			
		}
	},

	renderSearchResults: function() {
		var status = this.model.get('queryStatus');
		switch(status) {
			case 'OK':
				renderer.render(
					locationsMenu, 
					{predictions: this.model.get('queryPredictions')}, this.elms.$locationsMenu[0]
				);
				this.showLocationMenu();
				break;
			case 'noResults':
				this.hideLocationMenu();
				break;
			default:
				this.hideLocationMenu();
				console.warn('Google Query Failure: ', status);
				break;
		}
	},

	onLocationItemClick: function(e) {
		var item = e.currentTarget,
			$item = this.$(item),
			placeDescription = $item.attr('data-place-description'),
			placeId = $item.attr('data-place-id'),
			offset_y = -0.7,
			offset_x = 0;

		if (e && e.preventDefault) { e.preventDefault(); }

		this.map_api.getPlaceDetails({placeId: placeId}, function(place, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK ) {
				Backbone.trigger('map:clearMarkers');
				
				Backbone.trigger('map:setCenter', {
					lat: place.geometry.location.lat() + offset_y, 
					long: place.geometry.location.lng() + offset_x
				});
				
				Backbone.trigger('map:setMarker', {
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng()
				});
				
				Backbone.trigger('map:setZoom', 8);
			}
		});

		this.elms.$locationInput.val(placeDescription);
		this.elms.$startCalendar.focus();
	},

	onCalendarInputFocus: function(e) {
		this.hideLocationMenu();
	},

	onTravellerChange: function(e) {
		this.elms.$searchBtn.focus();
	},

	slideOutSearchArea: function() {
		this.elms.$searchArea.addClass('out');
	},

	slideInSearchArea: function() {
		this.elms.$searchArea.removeClass('out');
	},

	onSubmit: function(e) {
		var data = {};

		if (e && e.preventDefault) { e.preventDefault(); }

		this.reverseGeocodeClientGeo()
			.then(_.bind(function(result){
				this.elms.$searchForm.serializeArray().map(function(x){data[x.name] = x.value;});
				if (result && result.place_id) { data.home = result; }

				this.slideOutSearchArea();

				Backbone.trigger('landing_view:submit', data);
			}, this));
	}

});

module.exports = LandingView;
