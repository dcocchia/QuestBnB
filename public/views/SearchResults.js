var React 	= require('react');
var _ 		= require('lodash');
var Stars 	= require('./Stars');

var buildPageBtns = function(page, count, resultsPerPage) {
	var numPages = Math.ceil(count.totalResults / resultsPerPage);
	var pageBtns = [];
	var i = (page > 1) ? -1 : 0;
	var pageBtnMax = (i === 0) ? 3 : 2;
	var keyIndex = 0;

	//back arrow
	if (page > 1) { pageBtns.push(React.createElement(PageButton, {key: keyIndex += 1, isArrow: true, txt: "<", page: page-1})); }

	//page 1 btn, go back to start
	if (page > 3) { pageBtns.push(React.createElement(PageButton, {key: keyIndex += 1, txt: "1", page: 1})); }

	//spacer
	if (page >= 3) { pageBtns.push(React.createElement(PageButton, {key: keyIndex += 1, isEllip: true})); }

	//1 page before, current page, and one page after
	for (; i < pageBtnMax && (page + i) <= numPages; i++) {
		pageBtns.push(
			React.createElement(PageButton, {key: keyIndex += 1, isActive: !!(page + i === page), page: page + i, txt: page + i})
		);	
	}

	if ((numPages - page) >= 3) {
		//spacer
		pageBtns.push(React.createElement(PageButton, {key: keyIndex += 1, isEllip: true}));
		//last page btn, go to end
		pageBtns.push(React.createElement(PageButton, {key: keyIndex += 1, txt: numPages, page: numPages}));	
	}

	//next arrow
	if (page < numPages) { pageBtns.push(React.createElement(PageButton, {key: keyIndex += 1, isArrow: true, txt: ">", page: page+1})); }

	return pageBtns;
}

var PageButton = React.createClass({displayName: "PageButton",
	render: function() {
		var page = this.props.page;
		var txt = this.props.txt;
		var isActive = this.props.isActive || false;
		var isEllip = this.props.isEllip || false;
		var isArrow = this.props.isArrow || false;
		var linkClasses = 
			(isArrow) 
				? "pagination-btn arrow" 
				:(isActive) 
					? "pagination-btn active" 
					: "pagination-btn";
		var ariaLabel = "go to page " + page;

		var ellipSpan = (isEllip) ? React.createElement("span", {className: "ellip"}, "...") : "";
		var link = (!isEllip) ? React.createElement("a", {href: "?page=" + page, className: linkClasses, "aria-label": ariaLabel}, txt) : "";
		
		return (
			React.createElement("li", {"data-page": page}, 
				link, 
				ellipSpan
			)
		)
	}
});

var Result = React.createClass({displayName: "Result",
	render: function() {
		var result = this.props.result || {};
		var photos = result.photos || [];
		var activePhotoIndex = result.activePhotoIndex || 0;
		var photoSource = (result.photos[activePhotoIndex]) ? result.photos[activePhotoIndex].medium : "";
		var altTxt = (result.photos[0]) ? result.photos[0].caption : "";
		var photoBtns = function() {
			if (photos.length > 1) {
				return (
					React.createElement("div", {className: "photo-btns-wrapper"}, 
						React.createElement("div", {className: "next-photo", role: "button", "aria-label": "next photo"}), 
						React.createElement("div", {className: "prev-photo", role: "button", "aria-label": "previous photo"})
					)
				)
			} else {
				return undefined;
			}
		}();

		return (
			React.createElement("li", {className: "lodging-result col-sm-12 col-md-6", "data-id": result.id}, 
				React.createElement("div", {className: "result-img img-wrapper"}, 
					React.createElement("button", {className: "result-request-stay-btn btn btn-primary center"}, "Request to Book"), 
					React.createElement("div", {className: "result-price"}, 
						React.createElement("h6", null, React.createElement("span", {className: "dollar"}, "$"), result.price.nightly)
					), 
					React.createElement("img", {className: "center", src: photoSource, alt: altTxt}), 
					photoBtns
				), 
				React.createElement("div", {className: "result-body"}, 
					React.createElement("h3", {className: "text-ellip"}, result.attr.heading), 
					React.createElement("div", {className: "result-info text-muted text-ellip"}, 
						React.createElement("span", null, result.attr.roomType.text, " · "), 
						React.createElement("div", {className: "star-rating"}, 
							React.createElement(Stars, {rating: result.reviews.rating}), " · ", React.createElement("span", null, result.reviews.count, " reviews")
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
		var isLoading = this.props.isLoading || false;
		
		if (countTop > count.totalResults) {
			countTop = count.totalResults;
			countBottom = (countTop + 1) - this.props.resultsPerPage;
		}

		if (countBottom < 0) { countBottom = 0; }

		if (_.isNaN(countBottom) || countBottom === "NaN") {
			countBottom = 0;
		}

		if (_.isNaN(countTop) || countTop === "NaN") {
			countTop = 0;
		}

		if (_.isNaN(count.totalResults) || count.totalResults === "NaN") {
			count.totalResults = 0;
		}

		return (
			React.createElement("div", {className: (isLoading) ? "search-results-wrapper-inner loading" : "search-results-wrapper-inner"}, 
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