var renderer = require("../../../renderer/client_renderer");
var PageView = Backbone.View.extend({

	elms: {},

	render: function(template, data) {
		var modelData = (this.model) ? this.model.attributes : {};

		data || (data = {});

		_.extend(data, modelData);

		renderer.render(template, data, this.elms.$parentEl[0]);
	}
});

module.exports = PageView;