var fs = require('fs');
var React = require('react');
var Handlebars = require('handlebars');
require('node-jsx').install({extension: '.jsx'});
var layout = Handlebars.compile(fs.readFileSync('views/Layout.hbs').toString());
var headerView = React.createFactory(require('../views/HeaderView.jsx'));
var modalsView = React.createFactory(require('../views/ModalsView.jsx'));
var headerProps = { open: false };

function Renderer() {}

Renderer.prototype = {
	render: function(view, props) {
		var body = view(props);
		var header = headerView(headerProps);
		var modals = modalsView();
		var props = props || {};

		props.body = React.renderToString(body);
		props.header = React.renderToString(header);
		props.modals = React.renderToString(modals);

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