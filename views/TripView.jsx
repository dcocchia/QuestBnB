var React = require('react');

var TripView = React.createClass({
	render: function() {
		return (
			<div className="container">
				<h1>{this.props.title}</h1>
				<p>Trip ID: {this.props.data.id}</p>
			</div>
		)
	}
});

module.exports = TripView;