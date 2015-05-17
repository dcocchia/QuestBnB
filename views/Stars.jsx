var React = require('react');

var ForeGround = React.createClass({
	render: function() {
		var rating = this.props.rating;
		var ratingInt = Math.floor(rating);
		var ratingDec = parseFloat((rating % 1).toFixed(1));
		var stars = function() {
			var arr = [];

			for (var i = 0; i < ratingInt; i++) {
				arr.push(<span key={"_front_star" + i} className="star-filled star"></span>);
			}

			for (var i = 0; i < ratingDec; i++) {
				arr.push(<span key={"_front_star_half" + i} className="star-half-filled star"></span>);
			}

			return arr;
		}();

		return (
			<div className="foreground">
				{stars}
			</div>
		)
	}
});

var BackGround = React.createClass({
	render: function() {
		return (
			<div className="background">
				<span className="star-empty star"></span>
				<span className="star-empty star"></span>
				<span className="star-empty star"></span>
				<span className="star-empty star"></span>
				<span className="star-empty star"></span>
			</div>
		)
	}
})

var Stars = React.createClass({
	render: function() {
		var rating = this.props.rating || 0;
		
		return (
			<div className="star-rating">
				<ForeGround rating={rating}/>
				<BackGround />
			</div>
		)
	}
});

module.exports = Stars;