var renderer = require('../../../renderer/client_renderer');
var PageView = Backbone.View.extend({

	render: function(template, data) {
		var modelData = (this.model) ? this.model.attributes : {};

		data || (data = {});

		_.extend(data, modelData);

		renderer.render(template, data, this.elms.$parentEl[0]);

		this.setElement(this.elms.$parentEl.children(this.$el.selector));

		Backbone.trigger(template.displayName + ':render');
	}
});

module.exports = PageView;