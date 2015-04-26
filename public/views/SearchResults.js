var React = require('react');

var buildPageBtns = function(page, count, resultsPerPage) {
	var numPages = Math.ceil(count.totalResults / resultsPerPage);
	var pageBtns = [];
	var i = (page > 1) ? -1 : 0;
	var pageBtnMax = (i === 0) ? 3 : 2;
	var keyIndex = 0;

	if (page > 1) { pageBtns.push(React.createElement("li", {key: keyIndex}, React.createElement("a", {href: "?page=" + (page - 1), className: "arrow"}, "<"))); }
	keyIndex++;

	if (page > 3) { pageBtns.push(React.createElement("li", {key: keyIndex}, React.createElement("a", {href: "?page=1"}, "1"))); }
	keyIndex++;

	if (page >= 3) { pageBtns.push(React.createElement("li", {key: keyIndex}, React.createElement("span", {className: "ellip"}, "..."))); }
	keyIndex++;

	for (; i < pageBtnMax && (page + i) <= numPages; i++) {
		pageBtns.push(
			React.createElement("li", null, 
				React.createElement("a", {href: "?page=" + (page + i), className: (page + i === page) ? "active" : "", key: i}, page + i)
			)
		);	
	}

	if ((numPages - page) >= 3) {
		keyIndex++;
		pageBtns.push(React.createElement("li", {key: keyIndex}, React.createElement("span", {className: "ellip"}, "...")));
		keyIndex++;
		pageBtns.push(React.createElement("li", {key: keyIndex}, React.createElement("a", {href: "?page=" + numPages}, numPages)));	
	}

	keyIndex++;
	if (page < numPages) { pageBtns.push(React.createElement("li", {key: keyIndex}, React.createElement("a", {href: "?page=" + (page + 1), className: "arrow"}, ">"))); }

	return pageBtns;
}

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

var SearchResults = React.createClass({displayName: "SearchResults",
	render: function() {
		var results = this.props.results || [];
		var count = this.props.count || {};
		var countTop = (this.props.resultsPerPage * this.props.page);
		var countBottom = (countTop + 1) - this.props.resultsPerPage;
		
		if (countTop > count.totalResults) {
			countTop = count.totalResults;
			countBottom = (countTop + 1) - this.props.resultsPerPage;
		}

		return (
			React.createElement("div", {className: "search-results-wrapper-inner"}, 
				React.createElement("div", {className: "search-results-header"}, 
					React.createElement("h2", {className: "text-ellip"}, count.totalResults, " Rentals – ", this.props.location)
				), 
				React.createElement("ol", {className: "search-results left-full-width"}, 
					results.map(function(result, index) {
						return React.createElement(Result, {result: result, key: index})
					})
				), 
				React.createElement("div", {className: "search-results-footer"}, 
					React.createElement("p", null, " ", countBottom, " – ", countTop, " of ", count.totalResults, " Rentals "), 
					React.createElement("ul", null, 
						buildPageBtns(this.props.page, count, this.props.resultsPerPage)
					)
				)
			)
		);
	}
});

module.exports = SearchResults;