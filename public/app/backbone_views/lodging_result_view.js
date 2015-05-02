var lodging_result_view = Backbone.View.extend({

	_setEL: function() {
		this.setElement(this.$el.selector);
	},

	events: {
		'click .result-request-stay-btn': 'onRequestToBook',
		'click .chosen'					: 'onClickBookingStatus',
		'click .set-chosen'				: 'onSetLodingStatus',
		'click .next-photo'				: 'onNextPhoto',
		'click .prev-photo'				: 'onPrevPhoto'
	},

	initialize: function(opts) {
		opts || (opts = {});
		this.parentView				= opts.parentView;
		this.stop_model				= opts.stop_model;
		this.lodgings_collection	= opts.lodgings_collection;

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
		e.preventDefault();

		this.model.set('bookingStatus', 'pending');
		this.syncStopModel();
	},

	onNextPhoto: function(e) {
		e.preventDefault();
		var photosLen = this.model.get('photos').length;
		var currentActiveIndex = (this.model.get('activePhotoIndex')) || 0;
		var newActiveIndex = ((currentActiveIndex + 1) >= photosLen) ? 0 : currentActiveIndex + 1;
		this.model.set('activePhotoIndex', newActiveIndex);
	},

	onPrevPhoto: function(e) {
		e.preventDefault();
		var photosLen = this.model.get('photos').length;
		var currentActiveIndex = (this.model.get('activePhotoIndex'));
		var newActiveIndex = (currentActiveIndex === 0) ? photosLen - 1 : currentActiveIndex - 1;
		this.model.set('activePhotoIndex', newActiveIndex);
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

	destroy: function() {
		this.undelegateEvents();
		this.$el.removeData().unbind();
	}
});

module.exports = lodging_result_view;