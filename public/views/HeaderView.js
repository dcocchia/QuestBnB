var React = require('react');

var HeaderView = React.createClass({displayName: "HeaderView",
	render: function() {
		return (
			React.createElement("nav", {className: (this.props.open) ? "header-nav open" : "header-nav"}, 
				React.createElement("button", {className: "burger-menu-btn"}), 
				React.createElement("ul", {className: "nav-menu"}, 
					React.createElement("li", null, "What is this?"), 
					React.createElement("li", null, "My Trips")
				)
			)
		)
	}
});

module.exports = HeaderView;