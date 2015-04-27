var lodging_result_view = Backbone.View.extend({

	_setEL: function() {
		this.setElement(this.$el.selector);
	},

	events: {
		"click .result-request-stay-btn"	: "onRequestToBook",
		"click .next-photo"					: "onNextPhoto",
		"click .prev-photo"					: "onPrevPhoto"
	},

	initialize: function(opts) {
		opts || (opts = {});
		this.parentView				= opts.parentView;
		this.stop_model				= opts.stop_model;
		this.lodgings_collection	= opts.lodgings_collection;

		this._setEL();

		Backbone.on("lodgings_search_results_view:render", _.bind(function() {
			this._setEL();
		},this));
	},

	onRequestToBook: function(e) {		
		e.preventDefault();
		this.stop_model.set("lodging", this.model.toJSON());
	},

	onNextPhoto: function(e) {
		e.preventDefault();
		var photosLen = this.model.get("photos").length;
		var currentActiveIndex = (this.model.get("activePhotoIndex")) || 0;
		var newActiveIndex = ((currentActiveIndex + 1) >= photosLen) ? 0 : currentActiveIndex + 1;
		this.model.set("activePhotoIndex", newActiveIndex);
	},

	onPrevPhoto: function(e) {
		e.preventDefault();
		var photosLen = this.model.get("photos").length;
		var currentActiveIndex = (this.model.get("activePhotoIndex"));
		var newActiveIndex = (currentActiveIndex === 0) ? photosLen - 1 : currentActiveIndex - 1;
		this.model.set("activePhotoIndex", newActiveIndex);
	},


	destory: function() {
		this.undelegateEvents();
		this.$el.removeData().unBind();
	}
});

module.exports = lodging_result_view;