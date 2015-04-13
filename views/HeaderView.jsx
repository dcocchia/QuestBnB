var React = require('react');

var HeaderView = React.createClass({
	render: function() {
		return (
			<nav className={(this.props.open) ? "header-nav open" : "header-nav"}>
				<button className="burger-menu-btn"></button>
				<ul className="nav-menu panel">
					<li className="nav-menu-item explain">
						<a href="#explain" title="What is this?">What is this?</a>
					</li>
					<li className="nav-menu-item your-trips">
						<a href="#yourTrips" title="Your trips">Your trips</a>
					</li>
				</ul>
			</nav>
		)
	}
});

module.exports = HeaderView;