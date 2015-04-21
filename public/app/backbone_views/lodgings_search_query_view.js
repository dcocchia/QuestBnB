var renderer = require("../../../renderer/client_renderer");
var search_model = require("../backbone_models/search_model");

var lodgings_search_query_view = Backbone.View.extend({

	initialize: function(opts) {
		opts || (opts = {});
		this.template = opts.template;
		this.map_api = opts.map_api;
		this.lodgings_collection = opts.lodgings_collection;
		this.search_model = new search_model({
			map_api: this.map_api
		});

		this.model.on("change", _.bind(function(model) {
			this.render();
			this.lodgings_collection.fetchDebounced(model.attributes);
		}, this));

		this.search_model.on("change", _.bind(function() {
			this.render({
				location_props: this.search_model.toJSON()
			});
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