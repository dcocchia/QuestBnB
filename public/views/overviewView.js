var React = require('react');

var OverviewView = React.createClass({displayName: "OverviewView",
	render: function() {
		return (
			React.createElement("div", {className: "container"}, 
				React.createElement("h1", null, this.props.title)
			)
		)
	}
});

module.exports = OverviewView;