var React = require('react');

var Stylesheet = React.createClass({displayName: "Stylesheet",
	render: function(){
		return React.createElement("link", {href: this.props.src, rel: "stylesheet"});
	}
});

var Script = React.createClass({displayName: "Script",
	render: function(){
		return React.createElement("script", {src: this.props.src});
	}
});

var Layout = React.createClass({displayName: "Layout",
	render: function() {
		var styleSheets = this.props.styleSheets;
		var scripts = this.props.scripts;
		return (
			React.createElement("html", {lang: "eng"}, 
				React.createElement("head", null, 
					React.createElement("meta", {charSet: "UTF-8"}), 
					React.createElement("title", null, this.props.title), 
					React.createElement("link", {href: "/bootstrap/css/bootstrap.min.css", rel: "stylesheet"}), 
					React.createElement("link", {href: "/app/css/common.css", rel: "stylesheet"}), 
					styleSheets.map(function(sheet) {
						return React.createElement(Stylesheet, {src: sheet});
					})
				), 
				React.createElement("body", null, 
					this.props.body, 
					React.createElement("script", {type: "text/javascript", src: "https://maps.googleapis.com/maps/api/js?libraries=places"}), 
					React.createElement("script", {src: "/libraries.js"}), 
					React.createElement("script", {src: "/bundle.js"})

				)
			)
		)
	}
});

module.exports = Layout;