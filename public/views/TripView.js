var React = require('react');

var TripView = React.createClass({displayName: "TripView",
	render: function() {
		return (
			React.createElement("div", {className: "trip-page"}, 
				React.createElement("h1", null, this.props.title)
			)
		)
	}
});

module.exports = TripView;