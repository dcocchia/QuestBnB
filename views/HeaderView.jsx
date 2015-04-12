var React = require('react');

var HeaderView = React.createClass({
	render: function() {
		return (
			<nav className={(this.props.open) ? "header-nav open" : "header-nav"}>
				<button className="burger-menu-btn"></button>
				<ul className="nav-menu">
					<li>What is this?</li>
					<li>My Trips</li>
				</ul>
			</nav>
		)
	}
});

module.exports = HeaderView;