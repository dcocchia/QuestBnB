var lodging_result_view = Backbone.View.extend({

	_setEL: function() {
		this.setElement(this.$el.selector);
	},

	events: {
		'click .result-request-stay-btn'		: 'onRequestToBook',
		'mouseleave .result-request-stay-btn'	: 'destroyToolTip',
		'click .chosen'							: 'onClickBookingStatus',
		'click .set-chosen'						: 'onSetLodingStatus',
		'click .next-photo'						: 'onNextPhoto',
		'click .prev-photo'						: 'onPrevPhoto',
		'click .remove'							: 'onRemoveClick',
		'click .remove-tip .btn'				: 'onRemoveTipClick', 
		'mouseenter'							: 'onMouseEnter',
		'mouseleave'							: 'onMouseLeave',

	},

	initialize: function(opts) {
		opts || (opts = {});
		this.parentView				= opts.parentView;
		this.stop_model				= opts.stop_model;
		this.lodgings_collection	= opts.lodgings_collection;
		this.map_api				= opts.map_api;

		this._setEL();

		Backbone.on('lodgings_search_results_view:render', _.bind(function() {
			this._setEL();
		},this));

	},

	syncStopModel: function() {
		var modelData = this.model.toJSON();
		this.stop_model.set('lodging', modelData, {silent: true});
		this.stop_model.trigger('change');
	},

	onRequestToBook: function(e) {
		var checkin = this.stop_model.get('checkin');
		var checkout = this.stop_model.get('checkout');
		
		e.preventDefault();

		if (!checkin || !checkout) {
			this.showToolTip( $(e.currentTarget), {
				trigger: 'click',
				title: 'Please select check-in and check-out times before requesting to book.',
				placement: 'bottom'
			});
			return;
		}

		this.model.set('bookingStatus', 'pending');
		this.syncStopModel();
		Backbone.trigger(
			'StopView:scrollToElm', 
			this.parentView.$el.find('.search-page-lodging-wrapper')
		);
	},

	onNextPhoto: function(e) {
		e.preventDefault();
		var photosLen = this.model.get('photos').length;
		var currentActiveIndex = (this.model.get('activePhotoIndex')) || 0;
		var newActiveIndex = 
			((currentActiveIndex + 1) >= photosLen) 
			? 0 
			: currentActiveIndex + 1;

		this.model.set('activePhotoIndex', newActiveIndex);
	},

	onPrevPhoto: function(e) {
		e.preventDefault();
		var photosLen = this.model.get('photos').length;
		var currentActiveIndex = (this.model.get('activePhotoIndex'));
		var newActiveIndex = 
			(currentActiveIndex === 0) 
			? photosLen - 1 
			: currentActiveIndex - 1;
			
		this.model.set('activePhotoIndex', newActiveIndex);
	},

	onMouseEnter: function(e) {
		this.updateMapMarker({
			backgroundColor: 'blue'
		});
	},

	onMouseLeave: function(e) {
		this.updateMapMarker({
			backgroundColor: 'red'
		});
	},

	updateMapMarker: function(opts) {
		var marker = _.find(
			this.map_api.markers, _.bind(function(marker) {
				return (marker.get('id') === this.model.get('id'))
			}, this)
		);

		if (!marker) { return; }

		marker.setIcon(this.map_api.generateMarkerIcon({
			backgroundColor: opts.backgroundColor
		}));
	},

	onClickBookingStatus: function(e) {
		var bookingStatus = this.model.get('showStatusMenu') || false;
		e.preventDefault();

		this.model.set('showStatusMenu', !bookingStatus);
	},

	onSetLodingStatus: function(e) {
		var newStatus = $(e.currentTarget).attr('data-status');
		e.preventDefault();

		this.model.set({
			showStatusMenu: false,
			bookingStatus: newStatus
		});

		this.syncStopModel();
	},

	onRemoveClick: function(e) {
		var $target = $(e.currentTarget);
		e.preventDefault();

		$target.tooltip('destroy');
		this.showToolTip($target , {
			trigger: 'click',
			title: '<div class="remove-tip">' + 
				'<p>Removing this stop will cancel your request to book' + 
				' this lodging. Are you sure?</p>' + 
				'<button class="btn btn-primary" ' + 
				'data-action="yes">Yes</button>' + 
				'<button class="btn btn-primary" ' + 
				'data-action="no">No</button></div>',
			placement: 'left',
			html: true
		});
	},

	onRemoveTipClick: function(e) {
		var $target = $(e.currentTarget);
		var action = $target.attr('data-action');
		var $removeBtn = $target.closest('.tooltip').siblings('.remove');
		e.preventDefault();

		this.destroyToolTip({ currentTarget: $removeBtn[0] });

		if (action === 'yes') {
			Backbone.trigger('StopView:removeChosenLodging');
			return;
		}
	},

	showToolTip: function($elm, opts) {	
		$elm.tooltip(opts);
		if (opts.title) {
			$elm.attr('data-original-title', opts.title);
		}
		$elm.tooltip('show');
	},

	hideToolTip: function($elm) {
		$elm.tooltip('hide');
	},

	destroyToolTip: function(e) {
		if (!e) { return; }

		$(e.currentTarget).tooltip('destroy');
	},

	destroy: function() {
		this.undelegateEvents();
		this.$el.removeData().unbind();
	}
});

module.exports = lodging_result_view;