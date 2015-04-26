var _ = require('lodash');
var React = require('react');
var SearchQuery = require('./SearchQuery');
var SeachResults = require('./SeachResults');

var StopView = React.createClass({
	render: function() {
		var isServer = this.props.isServer || false;
		var lodgingData = this.props.lodgingData || {};
		var results = lodgingData.result || [];
		var locationProps = ( this.props.locationProps || {} );
		var modelData = _.cloneDeep(this.props);
		var bootStrapDataElm;

		if (isServer) {
			modelData = _.cloneDeep(this.props);
			delete modelData.lodgingData;
			bootStrapDataElm = (
				<div className="bootstrap-data">
					<span className="bootstrap-data-results" data-result-data={JSON.stringify(results)}></span>
					<span className="bootstrap-data-model" data-model-data={JSON.stringify(modelData)}></span>
				</div>
			);
		}

		return (
			<div className="stop-page">
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<h1 className="title left-full-width" role="textbox">{this.props.tripTitle} &#8211; Stop {this.props.stopNum}</h1>
						<div className="search-query-wrapper">
							<SearchQuery start={this.props.start} end={this.props.end} locationProps={this.props.locationProps} location={this.props.location}/>
						</div>
						<div className="search-results-wrapper left-full-width">
							<SeachResults page={lodgingData.page} count={lodgingData.count} results={results} resultsPerPage={lodgingData.resultsPerPage} location={this.props.location}/>
							{bootStrapDataElm}
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = StopView;