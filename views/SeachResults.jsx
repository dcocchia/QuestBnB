var React = require('react');

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

var SeachResults = React.createClass({
	render: function() {
		var results = this.props.results || [];
		return (
			<ol className="search-results left-full-width">
				{results.map(function(result, index) {
					return <Result result={result} key={index}/>
				})}
			</ol>
		);
	}
});

module.exports = SeachResults;