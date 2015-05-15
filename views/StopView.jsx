var _ = require('lodash');
var React = require('react');
var SearchQuery = require('./SearchQuery');
var SeachResults = require('./SearchResults');
var ChosenLodging = require('./ChosenLodging');
var humanNumbers = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

var StopView = React.createClass({
	render: function() {
		var isServer = this.props.isServer || false;
		var isLoading = this.props.isLoading || false;
		var chosenLodging = this.props.lodging;
		var lodgingData = this.props.lodgingData || {};
		var results = lodgingData.result || [];
		var locationProps = ( this.props.locationProps || {} );
		var tripId = this.props.tripId || "";
		var stopNum = parseInt(this.props.stopNum.index);
		var title = humanNumbers[stopNum - 1] + ' Location';
		var modelData;
		var lodgingDataModel;
		var bootStrapDataElm;

		if (isServer) {
			modelData = _.cloneDeep(this.props);
			delete modelData.lodgingData;
			
			lodgingDataModel = {
				count: lodgingData.count,
				resultsPerPage: lodgingData.resultsPerPage,
				page: lodgingData.page
			};

			bootStrapDataElm = (
				<div className="bootstrap-data">
					<span className="bootstrap-data-results" data-result-data={JSON.stringify(results)}></span>
					<span className="bootstrap-data-results-meta" data-result-meta-data={JSON.stringify(lodgingDataModel)}></span>
					<span className="bootstrap-data-model" data-model-data={JSON.stringify(modelData)}></span>
				</div>
			);
		}

		return (
			<div className="stop-page">
				<div className="side-bar panel">
					<div className="bleed-width-20">
						<div className="back-btn-wrapper col-lg-2 col-md-2 col-sm-12 col-xs-12">
							<a href={"/trips/" + tripId} className="btn btn-back">Back</a>
						</div>
						<div className="title-wrapper col-lg-10 col-md-10 col-sm-12 col-xs-12">
							<h1 className="title" role="textbox">{title}</h1>
						</div>
						<div className="search-query-wrapper">
							<SearchQuery checkin={this.props.checkin} checkout={this.props.checkout} locationProps={this.props.locationProps} location={this.props.location}/>
						</div>
						<div className="search-results-wrapper left-full-width">
							<div className="search-page-lodging-wrapper">
								<ChosenLodging data={chosenLodging}/>
							</div>
							<SeachResults page={lodgingData.page} count={lodgingData.count} results={results} resultsPerPage={lodgingData.resultsPerPage} location={this.props.location} isLoading={isLoading}/>
						</div>
						{bootStrapDataElm}
					</div>
				</div>
			</div>
		)
	}
});

module.exports = StopView;