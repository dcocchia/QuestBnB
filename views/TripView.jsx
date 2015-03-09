var React = require('react');

var TripView = React.createClass({
	render: function() {
		return (
			<div className="trip-page">
				<h1>{this.props.title}</h1>
			</div>
		)
	}
});

module.exports = TripView;