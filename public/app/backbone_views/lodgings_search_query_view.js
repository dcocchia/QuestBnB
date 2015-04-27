var renderer = require('../../../renderer/client_renderer');
var search_model = require('../backbone_models/search_model');

var lodgings_search_query_view = Backbone.View.extend({

	initialize: function(opts) {
		opts || (opts = {});
		this.template 				= opts.template;
		this.map_api 				= opts.map_api;
		this.lodgings_collection 	= opts.lodgings_collection;
		this.parentView				= opts.parentView;
		
		this.search_model = new search_model({
			map_api: this.map_api
		});

		this.model.on('change', _.bind(function(model) {
			this.render();
			this.lodgings_collection.fetchDebounced(model.attributes);
		}, this));

		this.search_model.on('change', _.bind(function() {
			this.render();
		}, this));

		Backbone.on('StopView:render', _.bind(function() {
			this.setElement(this.parentView.$el.find(this.$el.selector));
		}, this));
	},

	render: function(data) {
		var query_model = this.model.toJSON();
		var search_model = this.search_model.toJSON();
		var dataModel = {
			location_props: search_model 
		};

		Backbone.trigger('stop_view:query_view:render', dataModel)	
	}
});

module.exports = lodgings_search_query_view;