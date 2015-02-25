var React = require('react');
require('node-jsx').install({extension: '.jsx'});
var layout = React.createFactory(require('../views/Layout.jsx'));

function Renderer() {}

Renderer.prototype = {
	render: function(view, props) {
		var body = view(props);
		var props = props || {};

		props.body = body;

		return wrapWithLayout(body, props);
	}
}

module.exports = Renderer;

function wrapWithLayout(component, props) {
	return '<!DOCTYPE>' + React.renderToString(layout(props));
}