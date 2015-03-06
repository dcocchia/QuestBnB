var React = require('react');

var StopsView = React.createClass({displayName: "StopsView",
	render: function() {
		return (
			React.createElement("div", {className: "container"}, 
				React.createElement("h1", null, this.props.title)
			)
		)
	}
});

module.exports = StopsView;