var headerViewTemplate = require("../../views/HeaderView");
var renderer = require("../../../renderer/client_renderer");

var HeaderView = Backbone.View.extend({
	_findElms: function($parentEl) {
		this.elms.$parentEl = $parentEl;
	},

	elms: {},

	events: {
		"click" : "toggleMenu"
	},

	initialize: function(opts) {
		opts || (opts = {});

		this._findElms(opts.$parentEl);

		this.model.on("change", _.bind(function() {
			this.render();
		}, this));
	},

	render: function() {
		renderer.render(headerViewTemplate, this.model.attributes, this.elms.$parentEl[0]);

		this.setElement(this.elms.$parentEl.children(this.$el.selector));
	},

	toggleMenu: function() {
		var opened = this.model.get("open") || false;

		this.model.set({open: !opened})
	}
});

module.exports = HeaderView;