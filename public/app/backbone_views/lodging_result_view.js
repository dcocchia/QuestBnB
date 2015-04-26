var lodging_result_view = Backbone.View.extend({

	_setEL: function() {
		this.setElement(this.$el.selector);
	},

	events: {
		"click": "onClickElm"
	},

	initialize: function(opts) {
		opts || (opts = {});
		this.parentView	= opts.parentView;

		this._setEL();

		Backbone.on("lodgings_search_results_view:render", _.bind(function() {
			this._setEL();
		},this));
	},

	onClickElm: function(e) {
		console.log(this.model.get("id"));
	},

	destory: function() {
		this.undelegateEvents();
		this.$el.removeData().unBind();
	}
});

module.exports = lodging_result_view;