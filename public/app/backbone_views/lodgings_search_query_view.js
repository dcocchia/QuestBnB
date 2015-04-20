var renderer = require("../../../renderer/client_renderer");

var lodgings_search_query_view = Backbone.View.extend({

	initialize: function(opts) {
		opts || (opts = {});
		this.template = opts.template;
		this.lodgings_collection = opts.lodgings_collection;

		this.model.on("change", _.bind(function(model) {
			this.render();
			this.lodgings_collection.fetchDebounced(model.attributes);
		}, this));
	},

	render: function(data) {
		var modelData = (this.model) ? this.model.attributes : {};

		data || (data = {});

		_.extend(data, modelData);

		renderer.render(this.template, data, this.$el[0]);

		this.setElement(this.$el.selector);
	}
});

module.exports = lodgings_search_query_view;