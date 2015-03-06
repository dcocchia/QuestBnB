var React = require('react');

var StopView = React.createClass({displayName: "StopView",
	render: function() {
		return (
			React.createElement("div", {className: "container"}, 
				React.createElement("h1", null, this.props.title)
			)
		)
	}
});

module.exports = StopView;