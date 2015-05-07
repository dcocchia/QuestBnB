var renderer = require('../../../renderer/client_renderer');
var PageView = Backbone.View.extend({

	render: function(template, data) {
		var modelData = (this.model) ? this.model.toJSON() : {};

		if (!data) { data = {}; }

		_.extend(modelData, data);

		renderer.render(template, modelData, this.elms.$parentEl[0]);

		this.setElement(this.elms.$parentEl.children(this.$el.selector));

		Backbone.trigger(template.displayName + ':render');
	}
});

module.exports = PageView;