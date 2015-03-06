var React = require('react');

var TripView = React.createClass({displayName: "TripView",
	render: function() {
		return (
			React.createElement("div", {className: "container"}, 
				React.createElement("h1", null, this.props.title), 
				React.createElement("p", null, "Trip ID: ", this.props.data.id)
			)
		)
	}
});

module.exports = TripView;