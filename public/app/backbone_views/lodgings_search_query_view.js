var renderer = require('../../../renderer/client_renderer');
var search_model = require('../backbone_models/search_model');

var lodgings_search_query_view = Backbone.View.extend({

	events: {
		'keydown .stop-location-title'	: 'onEditKeyDown',
		'click .location-item'			: 'onLocationItemClick',
		'click .clear'					: 'onClearClick',
		'click .remove'					: 'onRemoveClick'
	},

	initialize: function(opts) {
		opts || (opts = {});
		this.template 				= opts.template;
		this.map_api 				= opts.map_api;
		this.lodgings_collection 	= opts.lodgings_collection;
		this.lodgings_meta_model	= opts.lodgings_meta_model;
		this.trip_model				= opts.trip_model;
		this.parentView				= opts.parentView;
		this.stop_model				= opts.stop_model;
		
		this.search_model = new search_model({
			map_api: this.map_api
		});

		this.sendQuery = _.debounce( _.bind( function(options) {
			this.search_model.getQueryPredictions(options);
		}, this), 500);

		this.model.on('change', _.bind(function(model) {
			this.render();
			this.stop_model.set({
				location: this.model.get('location'),
				geo: this.model.get('geo')
			});
			Backbone.trigger('StopView:showSpinner');
			this.lodgings_collection.fetchDebounced();
		}, this));

		this.search_model.on('change', _.bind(function() {
			this.render();
		}, this));

		Backbone.on('StopView:render', _.bind(function() {
			this.setElement(this.parentView.$el.find(this.$el.selector));
			this.bindDatePickersDebounced();
		}, this));

		Backbone.on('slider:update', _.bind(function(values) {
			this.lodgings_meta_model.set({
				pricemin: values[0],
				pricemax: values[1]
			});
			Backbone.trigger('StopView:showSpinner');
			this.lodgings_collection.fetchDebounced();
		}, this));

		this.bindDatePickers();
	},

	render: function(data) {
		var query_model = this.model.toJSON();
		var search_model = this.search_model.toJSON();
		var dataModel = {
			location_props: search_model 
		};

		Backbone.trigger('stop_view:query_view:render', dataModel)	
	},

	updateStopDates: function(timeType, newTime) {
		var start;
		var end;

		this.lodgings_meta_model.attributes[timeType] = 
			moment(newTime).valueOf();

		start = this.lodgings_meta_model.get("stimestamp");
		end = this.lodgings_meta_model.get("etimestamp");

		this.stop_model.set({
			checkin: moment(start).format('MM/DD/YYYY'),
			checkout: moment(end).format('MM/DD/YYYY'),
			checkinUTC: start,
			checkoutUTC: end
		});

		Backbone.trigger('StopView:showSpinner');
		this.lodgings_collection.fetchDebounced();
	},

	bindDatePickers: function() {
		var $dateWrapper = this.$('.date-input-wrapper');

		$dateWrapper.find('.date.start').datepicker({
			minDate: this.stop_model.get('tripStart') || 0,
			maxDate: this.stop_model.get('tripEnd') || 0,
			onSelect: _.bind( function(resp) {
				this.updateStopDates('stimestamp', resp);
			}, this)
		});
		$dateWrapper.find('.date.end').datepicker({
			minDate: this.stop_model.get('tripStart') || 0,
			maxDate: this.stop_model.get('tripEnd') || 0,
			onSelect: _.bind( function(resp) {
				this.updateStopDates('etimestamp', resp);
			}, this)
		});
	},

	bindDatePickersDebounced: _.debounce(function() { 
		this.bindDatePickers();
	}, 500),

	onEditKeyDown: function(e) {
		var target = e.currentTarget;

		switch(e.keyCode) {
			case 40:
				this.focusNextLocationItem(target, e);
				break;
			case 38:
				this.focusPrevLocationItem(target, e);
				break;
			case 13: 
				this.onLocationKeydown(e);
				break;
			default: 
				this.locationSearch(e);
				break;
		}
		
	},

	onLocationKeydown: function(e) {
		var $active, $locationsMenu;

		if (e.keyCode === 13) {
			if (e && e.preventDefault) { e.preventDefault(); }

			$locationsMenu = $(e.currentTarget).siblings('.locations-menu');
			$active = $locationsMenu.find('.location-item.active');

			if ($active.length > 0) {
				$active.click();
			} else {
				$active = $locationsMenu.find('.location-item').first();
				$active.click();
			}
		}
	},

	focusNextLocationItem: function(target, e) {
		var $locationsMenu = $(target).siblings('.locations-menu'),
			$locationItems = $locationsMenu.find('.location-item'),
			$activeItem = $locationItems.filter('.active'),
			$next;

		if (e && e.preventDefault) { e.preventDefault(); }

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

	focusPrevLocationItem: function(target, e) {
		var $locationsMenu = $(target).siblings('.locations-menu'),
			$locationItems = $locationsMenu.find('.location-item'),
			$activeItem = $locationItems.filter('.active'),
			$prev;

		if (e && e.preventDefault) { e.preventDefault(); }

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

	locationSearch: function(e) {
		var target = e.currentTarget,
			text = (
				target 
				&& target.textContent 
				&& typeof(target.textContent) != 'undefined'
			) 
			? target.textContent 
			: target.innerText;		

		if (text) { this.sendQuery({input: text}); }
	},

	onLocationItemClick: function(e) {
		var item = e.currentTarget,
			$item = this.$(item),
			placeDescription = $item.attr('data-place-description'),
			placeId = $item.attr('data-place-id'),
			offset_y = -0.7,
			offset_x = 0;

		if (e && e.preventDefault) { e.preventDefault(); }

		this.map_api.getPlaceDetails(
			{placeId: placeId}, 
			_.bind(function(place, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK ) {
					$item.closest('.locations-menu')
						.siblings('.stop-location-title')
						.blur();
					this.clearAllRanges();

					this.model.set({
						location: placeDescription,
						address: place.formatted_address,
						place_id: place.place_id,
						id: place.id,
						geo: {
							lat: place.geometry.location.lat(),
							lng: place.geometry.location.lng()
						}
					});
					
					this.search_model.clear();
				}
			}, this)
		);

	},

	onClearClick: function(e) {
		var $target = this.$(e.currentTarget).siblings('.stop-location-title');

		if (e.preventDefault) { e.preventDefault(); }

		$target.text('');
	},

	clearAllRanges: function() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection.createRange) {
			var range = document.selection.createRange();
			document.selection.empty();
		}
	}
});

module.exports = lodgings_search_query_view;