var React = require('react');

var Result = React.createClass({displayName: "Result",
	render: function() {
		var result = this.props.result || {};
		return (
			React.createElement("li", {className: "lodging-result col-sm-12 col-md-6", "data-id": result.id}, 
				React.createElement("div", {className: "result-img img-wrapper"}, 
					React.createElement("button", {className: "result-request-stay-btn btn btn-primary center"}, "Request to Book"), 
					React.createElement("div", {className: "result-price"}, 
						React.createElement("h6", null, React.createElement("span", {className: "dollar"}, "$"), result.price.nightly)
					), 
					React.createElement("img", {className: "center", src: (result.photos && result.photos[0]) ? result.photos[0].medium : ""})
				), 
				React.createElement("div", {className: "result-body"}, 
					React.createElement("h3", {className: "text-ellip"}, result.attr.heading), 
					React.createElement("div", {className: "result-info text-muted text-ellip"}, 
						React.createElement("span", null, result.attr.roomType.text, " · "), 
						React.createElement("div", {className: "star-rating"}, 
							"· ", React.createElement("span", null, result.reviews.count, " reviews")
						)
					)
				)
			)
		);
	}
});

var SeachResults = React.createClass({displayName: "SeachResults",
	render: function() {
		var results = this.props.results || [];
		return (
			React.createElement("ol", {className: "search-results left-full-width"}, 
				results.map(function(result, index) {
					return React.createElement(Result, {result: result, key: index})
				})
			)
		);
	}
});

module.exports = SeachResults;