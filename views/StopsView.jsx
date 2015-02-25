var React = require('react');

var StopsView = React.createClass({
	render: function() {
		return (
			<div className="container">
				<h1>{this.props.title}</h1>
			</div>
		)
	}
});

module.exports = StopsView;