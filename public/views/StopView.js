var React = require('react');
var SearchQuery = require('./SearchQuery');
var SeachResults = require('./SeachResults');

var StopView = React.createClass({displayName: "StopView",
	render: function() {
		var isServer = this.props.isServer || false;
		var lodgingData = this.props.lodgingData || {};
		var results = lodgingData.result || [];
		var locationProps = ( this.props.locationProps || {} );
		var bootStrapDataElm;

		if (isServer) {
			bootStrapDataElm = React.createElement("div", {className: "results-data"}, React.createElement("span", {"data-result-data": JSON.stringify(results)}));
		}

		return (
			React.createElement("div", {className: "stop-page"}, 
				React.createElement("div", {className: "side-bar panel"}, 
					React.createElement("div", {className: "bleed-width-20"}, 
						React.createElement("h1", {className: "title left-full-width", role: "textbox"}, this.props.tripTitle, " – Stop ", this.props.stopNum), 
						React.createElement("div", {className: "search-query-wrapper"}, 
							React.createElement(SearchQuery, {start: this.props.start, end: this.props.end, locationProps: this.props.locationProps, location: this.props.location})
						), 
						React.createElement("div", {className: "search-results-wrapper left-full-width"}, 
							React.createElement(SeachResults, {page: lodgingData.page, count: lodgingData.count, results: results, resultsPerPage: lodgingData.resultsPerPage, location: this.props.location}), 
							bootStrapDataElm
						)
					)
				)
			)
		)
	}
});

module.exports = StopView;