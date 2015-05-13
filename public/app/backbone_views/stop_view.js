var search_model = require('../backbone_models/search_model');

var StopView = Backbone.View.extend({
	events: {
		'keydown .stop-location-title'	: 'onEditKeyDown',
		'click .location-item'			: 'onLocationItemClick',
		'click .clear'					: 'onClearClick',
		'click .remove'					: 'onRemoveClick',
		'click .lodging-booking-status' : 'onLodgingStatusClick',
		'click .next-photo'				: 'onNextPhoto',
		'click .prev-photo'				: 'onPrevPhoto',
		'click .remove-tip .btn'		: 'onRemoveTipClick'
	},

	initialize: function(opts) {
		this.stopId = opts.stopId;
		this.map_api = opts.map_api;
		this.search_model = new search_model({
			map_api: this.map_api
		});

		this.model.on('active', _.bind(function() {
			this.focus();
		}, this));

		Backbone.on('TripView:render', _.bind(function() {
			this.setElement(this.$el.selector);
		}, this));

		this.search_model.on('change', _.bind(function() {
			Backbone.trigger(
				'trip_view:location_search', 
				this.search_model, 
				this.model
			);
		}, this));

		this.sendQuery = _.debounce( _.bind( function(options) {
			this.search_model.getQueryPredictions(options);
		}, this), 500);
		
	},

	onNextPhoto: function(e) {
		e.preventDefault();
		var lodging = this.model.get('lodging');
		var photos = lodging.photos || [];
		var photosLen = photos.length;
		var currentActiveIndex = lodging.activePhotoIndex || 0;
		var newActiveIndex = 
			((currentActiveIndex + 1) >= photosLen) 
			? 0 
			: currentActiveIndex + 1;

		lodging.activePhotoIndex = newActiveIndex;
		Backbone.trigger('StopView:doRender');
	},

	onPrevPhoto: function(e) {
		e.preventDefault();
		var lodging = this.model.get('lodging');
		var photos = lodging.photos || [];
		var photosLen = photos.length;
		var currentActiveIndex = lodging.activePhotoIndex || 0;
		var newActiveIndex = 
			(currentActiveIndex === 0) 
			? photosLen - 1 
			: currentActiveIndex - 1;
			
		lodging.activePhotoIndex = newActiveIndex;
		Backbone.trigger('StopView:doRender');
	},

	onEditKeyDown: function(e) {
		var target = e.currentTarget;

		switch(e.keyCode) {
			case 40:
				//up arrow
				this.focusNextLocationItem(target, e);
				break;
			case 38:
				//down arrow
				this.focusPrevLocationItem(target, e);
				break;
			case 13: 
				//enter key
				this.onLocationKeydown(e);
				break;
			case 27: 
				//escape key
				$(target).blur();
				this.search_model.clear();
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
	},

	focus: function(stop) {
		this.$('.stop-location-title').focus();
	},

	onRemoveClick: function(e) {
		var $target = $(e.currentTarget);
		var lodging = this.model.get('lodging');

		e.preventDefault();

		if (!_.isEmpty(lodging)) {
			this.showToolTip( $target, {
				trigger: 'click',
				title: '<div class="remove-tip">' + 
					'<p>Removing this stop will cancel your request to book' + 
					' this lodging. Are you sure?</p>' + 
					'<button class="btn btn-primary" ' + 
					'data-action="yes">Yes</button>' + 
					'<button class="btn btn-primary" ' + 
					'data-action="no">No</button></div>',
				placement: 'auto',
				html: true
			});
			return;
		}

		this.destroyToolTip($target);
		this.removeStop();
	},

	removeStop: function() {
		var stopId = this.$el.attr('data-stop-id');
		this.model.startRemove(stopId);
	},

	onRemoveTipClick: function(e) {
		var $target = $(e.currentTarget);
		var action = $target.attr('data-action');
		var $removeBtn = $target.closest('.tooltip').siblings('.remove');
		e.preventDefault();

		this.destroyToolTip($removeBtn);

		if (action === 'yes') {
			this.removeStop();
			return;
		}
	},

	onLodgingStatusClick: function(e) {
		e.preventDefault();
		Backbone.trigger('TripView:go_to_stop', this.stopId);
	},

	showToolTip: function($elm, opts) {
		this.destroyToolTip($elm);
		$elm.tooltip(opts);
		$elm.attr('data-original-title', opts.title);
		$elm.tooltip('show');
		this.setElement(this.$el.selector);
	},

	hideToolTip: function($elm) {
		$elm.tooltip('hide');
	},

	destroyToolTip: function($elm) {
		$elm.tooltip('destroy');
	},

	destroy: function() {
		this.undelegateEvents();

		this.$el.removeData().unbind(); 
	}
});

module.exports = StopView;