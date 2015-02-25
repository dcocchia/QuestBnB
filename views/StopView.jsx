var React = require('react');

var StopView = React.createClass({
	render: function() {
		return (
			<div className="container">
				<h1>{this.props.title}</h1>
			</div>
		)
	}
});

module.exports = StopView;