var React = require('react');

var HeaderView = React.createClass({displayName: "HeaderView",
	render: function() {
		return (
			React.createElement("nav", {className: (this.props.open) ? "header-nav open" : "header-nav"}, 
				React.createElement("button", {className: "burger-menu-btn"}), 
				React.createElement("ul", {className: "nav-menu panel"}, 
					React.createElement("li", {className: "nav-menu-item explain"}, 
						React.createElement("a", {href: "#explain", title: "What is this?"}, "What is this?")
					), 
					React.createElement("li", {className: "nav-menu-item your-trips"}, 
						React.createElement("a", {href: "#yourTrips", title: "Your trips"}, "Your trips")
					)
				)
			)
		)
	}
});

module.exports = HeaderView;