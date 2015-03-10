var fs = require('fs');
var React = require('react');
var Handlebars = require('handlebars');
require('node-jsx').install({extension: '.jsx'});
var layout = Handlebars.compile(fs.readFileSync('views/Layout.hbs').toString());

function Renderer() {}

Renderer.prototype = {
	render: function(view, props) {
		var body = view(props);
		var props = props || {};

		props.body = React.renderToString(body);

		return wrapWithLayout(props);
	}
}

module.exports = Renderer;

function wrapWithLayout(props) {
	try {
		return layout(props);	
	} catch (err) {
		return res.status(500).type('text').send(err.message);
	}
	
}