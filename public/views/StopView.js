var _ = require('lodash');
var React = require('react');
var SearchQuery = require('./SearchQuery');
var SeachResults = require('./SearchResults');
var ChosenLodging = require('./ChosenLodging');
var humanNumbers = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

var StopView = React.createClass({displayName: "StopView",
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
				React.createElement("div", {className: "bootstrap-data"}, 
					React.createElement("span", {className: "bootstrap-data-results", "data-result-data": JSON.stringify(results)}), 
					React.createElement("span", {className: "bootstrap-data-results-meta", "data-result-meta-data": JSON.stringify(lodgingDataModel)}), 
					React.createElement("span", {className: "bootstrap-data-model", "data-model-data": JSON.stringify(modelData)})
				)
			);
		}

		return (
			React.createElement("div", {className: "stop-page"}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("div", {className: "bleed-width-20"}, 
						React.createElement("div", {className: "back-btn-wrapper col-lg-2 col-md-2 col-sm-12 col-xs-12"}, 
							React.createElement("a", {href: "/trips/" + tripId, className: "btn btn-back"}, "Back")
						), 
						React.createElement("div", {className: "title-wrapper col-lg-10 col-md-10 col-sm-12 col-xs-12"}, 
							React.createElement("h1", {className: "title", role: "textbox"}, title)
						), 
						React.createElement("div", {className: "search-query-wrapper"}, 
							React.createElement(SearchQuery, {checkin: this.props.checkin, checkout: this.props.checkout, locationProps: this.props.locationProps, location: this.props.location})
						), 
						React.createElement("div", {className: "search-results-wrapper left-full-width"}, 
							React.createElement("div", {className: "search-page-lodging-wrapper"}, 
								React.createElement(ChosenLodging, {data: chosenLodging})
							), 
							React.createElement(SeachResults, {page: lodgingData.page, count: lodgingData.count, results: results, resultsPerPage: lodgingData.resultsPerPage, location: this.props.location, isLoading: isLoading})
						), 
						bootStrapDataElm
					)
				)
			)
		)
	}
});

module.exports = StopView;