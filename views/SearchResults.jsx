var React = require('react');

var buildPageBtns = function(page, count, resultsPerPage) {
	var numPages = Math.ceil(count.totalResults / resultsPerPage);
	var pageBtns = [];
	var i = (page > 1) ? -1 : 0;
	var pageBtnMax = (i === 0) ? 3 : 2;
	var keyIndex = 0;

	if (page > 1) { pageBtns.push(<li key={keyIndex}><a href={"?page=" + (page - 1)} className="arrow">&lt;</a></li>); }
	keyIndex++;

	if (page > 3) { pageBtns.push(<li key={keyIndex}><a href="?page=1">1</a></li>); }
	keyIndex++;

	if (page >= 3) { pageBtns.push(<li key={keyIndex}><span className="ellip">...</span></li>); }
	keyIndex++;

	for (; i < pageBtnMax && (page + i) <= numPages; i++) {
		pageBtns.push(
			<li>
				<a href={"?page=" + (page + i)} className={(page + i === page) ? "active" : ""} key={i}>{page + i}</a>
			</li>
		);	
	}

	if ((numPages - page) >= 3) {
		keyIndex++;
		pageBtns.push(<li key={keyIndex}><span className="ellip">...</span></li>);
		keyIndex++;
		pageBtns.push(<li key={keyIndex}><a href={"?page=" + numPages}>{numPages}</a></li>);	
	}

	keyIndex++;
	if (page < numPages) { pageBtns.push(<li key={keyIndex}><a href={"?page=" + (page + 1)} className="arrow">&gt;</a></li>); }

	return pageBtns;
}

var Result = React.createClass({
	render: function() {
		var result = this.props.result || {};
		return (
			<li className="lodging-result col-sm-12 col-md-6" data-id={result.id}>
				<div className="result-img img-wrapper">
					<button className="result-request-stay-btn btn btn-primary center">Request to Book</button>
					<div className="result-price">
						<h6><span className="dollar">$</span>{result.price.nightly}</h6>
					</div>
					<img className="center" src={(result.photos && result.photos[0]) ? result.photos[0].medium : ""} />
				</div>
				<div className="result-body">
					<h3 className="text-ellip">{result.attr.heading}</h3>
					<div className="result-info text-muted text-ellip">
						<span>{result.attr.roomType.text} &middot; </span>
						<div className="star-rating">
							&middot; <span>{result.reviews.count} reviews</span>
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
		
		if (countTop > count.totalResults) {
			countTop = count.totalResults;
			countBottom = (countTop + 1) - this.props.resultsPerPage;
		}

		return (
			<div className="search-results-wrapper-inner">
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