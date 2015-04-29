var React = require('react');

var ForeGround = React.createClass({displayName: "ForeGround",
	render: function() {
		var rating = this.props.rating;
		var ratingInt = Math.floor(rating);
		var ratingDec = parseFloat((rating % 1).toFixed(1));
		var stars = function() {
			var arr = [];

			for (var i = 0; i < ratingInt; i++) {
				arr.push(React.createElement("span", {className: "star-filled star"}));
			}

			for (var i = 0; i < ratingDec; i++) {
				arr.push(React.createElement("span", {className: "star-half-filled star"}));
			}

			return arr;
		}();

		return (
			React.createElement("div", {className: "foreground"}, 
				stars
			)
		)
	}
});

var BackGround = React.createClass({displayName: "BackGround",
	render: function() {
		return (
			React.createElement("div", {className: "background"}, 
				React.createElement("span", {className: "star-empty star"}), 
				React.createElement("span", {className: "star-empty star"}), 
				React.createElement("span", {className: "star-empty star"}), 
				React.createElement("span", {className: "star-empty star"}), 
				React.createElement("span", {className: "star-empty star"})
			)
		)
	}
})

var Stars = React.createClass({displayName: "Stars",
	render: function() {
		var rating = this.props.rating || 0;
		
		return (
			React.createElement("div", {className: "star-rating"}, 
				React.createElement(ForeGround, {rating: rating}), 
				React.createElement(BackGround, null)
			)
		)
	}
});

module.exports = Stars;