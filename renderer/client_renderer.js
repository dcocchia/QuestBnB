var React = require('react');

function Renderer() {}

Renderer.prototype = {
	render: function(view, props, targetElm) {
		var r_element = React.createElement(view, props);
		React.render(r_element, targetElm);
	}
}

module.exports = new Renderer();