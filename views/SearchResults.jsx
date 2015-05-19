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
	if (page > 1) { pageBtns.push(<PageButton key={keyIndex += 1} isArrow={true} txt="&lt;" page={page-1} />); }

	//page 1 btn, go back to start
	if (page > 3) { pageBtns.push(<PageButton key={keyIndex += 1} txt="1" page={1} />); }

	//spacer
	if (page >= 3) { pageBtns.push(<PageButton key={keyIndex += 1} isEllip={true} />); }

	//1 page before, current page, and one page after
	for (; i < pageBtnMax && (page + i) <= numPages; i++) {
		pageBtns.push(
			<PageButton key={keyIndex += 1} isActive={!!(page + i === page)} page={page + i} txt={page + i}/>
		);	
	}

	if ((numPages - page) >= 3) {
		//spacer
		pageBtns.push(<PageButton key={keyIndex += 1} isEllip={true} />);
		//last page btn, go to end
		pageBtns.push(<PageButton key={keyIndex += 1} txt={numPages} page={numPages} />);	
	}

	//next arrow
	if (page < numPages) { pageBtns.push(<PageButton key={keyIndex += 1} isArrow={true} txt="&gt;" page={page+1} />); }

	return pageBtns;
}

var PageButton = React.createClass({
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

		var ellipSpan = (isEllip) ? <span className="ellip">...</span> : "";
		var link = (!isEllip) ? <a href={"?page=" + page} className={linkClasses} aria-label={ariaLabel}>{txt}</a> : "";
		
		return (
			<li data-page={page}>
				{link}
				{ellipSpan}
			</li>
		)
	}
});

var Result = React.createClass({
	render: function() {
		var result = this.props.result || {};
		var photos = result.photos || [];
		var activePhotoIndex = result.activePhotoIndex || 0;
		var photoSource = (result.photos[activePhotoIndex]) ? result.photos[activePhotoIndex].medium : "";
		var altTxt = (result.photos[0]) ? result.photos[0].caption : "";
		var photoBtns = function() {
			if (photos.length > 1) {
				return (
					<div className="photo-btns-wrapper">
						<div className="next-photo" role="button" aria-label="next photo"></div>
						<div className="prev-photo" role="button" aria-label="previous photo"></div>
					</div>
				)
			} else {
				return undefined;
			}
		}();

		return (
			<li className="lodging-result col-sm-12 col-md-6" data-id={result.id}>
				<div className="result-img img-wrapper">
					<button className="result-request-stay-btn btn btn-primary center">Request to Book</button>
					<div className="result-price">
						<h6><span className="dollar">$</span>{result.price.nightly}</h6>
					</div>
					<img className="center" src={photoSource}  alt={altTxt}/>
					{photoBtns}
				</div>
				<div className="result-body">
					<h3 className="text-ellip">{result.attr.heading}</h3>
					<div className="result-info text-muted text-ellip">
						<span>{result.attr.roomType.text} &middot; </span>
						<div className="star-rating">
							<Stars rating={result.reviews.rating}/> &middot; <span>{result.reviews.count} reviews</span>
						</div>
					</div>
				</div>
			</li>
		);
	}
});

var SearchResults = React.createClass({
	render: function() {
		var results = this.props.results || [];
		var count = this.props.count || {};
		var countTop = (this.props.resultsPerPage * this.props.page);
		var countBottom = (countTop + 1) - this.props.resultsPerPage;
		var isLoading = this.props.isLoading || false;
		
		if (countTop > count.totalResults) {
			countBottom = (countTop + 1) - this.props.resultsPerPage;
			countTop = count.totalResults;
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
			<div className={(isLoading) ? "search-results-wrapper-inner loading" : "search-results-wrapper-inner"}>
				<div className="search-results-header">
					<h2 className="text-ellip">{count.totalResults} Rentals &#8211; {this.props.location}</h2>
				</div>
				<ol className="search-results left-full-width">
					{results.map(function(result, index) {
						return <Result result={result} key={index}/>
					})}
				</ol>
				<div className="search-results-footer">
					<p> {countBottom} – {countTop} of {count.totalResults} Rentals </p>
					<ul>
						{buildPageBtns(this.props.page, count, this.props.resultsPerPage)}
					</ul>
				</div>
			</div>
		);
	}
});

module.exports = SearchResults;