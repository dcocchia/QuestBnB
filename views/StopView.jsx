var React = require('react');
var SearchQuery = require('./SearchQuery');
var SeachResults = require('./SeachResults');

var StopView = React.createClass({
	render: function() {
		var isServer = this.props.isServer || false;
		var lodgingData = this.props.lodgingData || {};
		var results = lodgingData.result || [];
		var locationProps = ( this.props.locationProps || {} );
		var bootStrapDataElm;

		if (isServer) {
			bootStrapDataElm = <div className="results-data"><span data-result-data={JSON.stringify(results)}></span></div>;
		}

		return (
			<div className="stop-page">
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<h1 className="title left-full-width" role="textbox">{this.props.tripTitle} &#8211; Stop {this.props.stopNum}</h1>
						<div className="search-query-wrapper">
							<SearchQuery locationProps={this.props.locationProps} location={this.props.location}/>
						</div>
						<div className="search-results-wrapper left-full-width">
							<SeachResults results={results} />
							<div className="search-results-footer">
								<button className="btn btn-primary">Next</button>
							</div>
							{bootStrapDataElm}
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = StopView;